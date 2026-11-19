<?php
/**
 * Plugin Name: MotorHearts Content
 * Description: Editorial homepage selections, category artwork, contributor profiles and public REST fields for the MotorHearts React website.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 */
if (!defined('ABSPATH')) { exit; }

function mh_specs($text) {
    $specs = array();
    foreach (preg_split('/\r?\n/', $text) as $line) {
        $parts = explode('|', $line, 2);
        if (count($parts) === 2 && trim($parts[0]) !== '' && trim($parts[1]) !== '') {
            $specs[] = array('label' => sanitize_text_field(trim($parts[0])), 'value' => sanitize_text_field(trim($parts[1])));
        }
    }
    return $specs;
}
function mh_post_fields($object) {
    $id = $object['id'];
    $data = array();
    foreach (array('hero', 'spotlight', 'featured', 'guide') as $key) { $data[$key] = (bool) get_post_meta($id, '_mh_' . $key, true); }
    foreach (array('dek', 'pull_quote') as $key) { $data[$key] = (string) get_post_meta($id, '_mh_' . $key, true); }
    foreach (array('read_time', 'primary_category', 'featured_order') as $key) { $data[$key] = (int) get_post_meta($id, '_mh_' . $key, true); }
    $data['specs'] = mh_specs((string) get_post_meta($id, '_mh_specs', true));
    return $data;
}
add_action('rest_api_init', function () {
    register_rest_field('post', 'motorhearts', array('get_callback' => 'mh_post_fields', 'schema' => array('type' => 'object', 'context' => array('view', 'embed'), 'readonly' => true)));
    register_rest_field('category', 'motorhearts', array('get_callback' => function ($object) { return array('image' => (string) get_term_meta($object['id'], '_mh_image', true)); }, 'schema' => array('type' => 'object', 'context' => array('view', 'embed'), 'readonly' => true)));
    register_rest_field('user', 'motorhearts', array('get_callback' => function ($object) { return array('role' => (string) get_user_meta($object['id'], '_mh_role', true), 'image' => (string) get_user_meta($object['id'], '_mh_image', true)); }, 'schema' => array('type' => 'object', 'context' => array('view', 'embed'), 'readonly' => true)));
});
add_action('init', function () { add_post_type_support('post', array('thumbnail', 'excerpt')); });
add_action('after_setup_theme', function () { add_theme_support('post-thumbnails'); });
register_activation_hook(__FILE__, function () {
    $categories = array(
        'cars' => array('Cars', 'Road tests, launches and the machines that define an era.'),
        'motorcycles' => array('Motorcycles', 'Two wheels, open roads and the art of balance.'),
        'electric-bikes' => array('Electric Bikes', 'The quiet revolution reshaping how cities move.'),
        'classic-cars' => array('Classic Cars', 'Restorations, provenance and timeless design.'),
        'performance-tuning' => array('Performance & Tuning', 'Engineering, setup and the pursuit of the perfect lap.'),
        'trailers' => array('Trailers & Transport', 'Towing, touring and taking the journey further.')
    );
    foreach ($categories as $slug => $values) {
        if (!get_term_by('slug', $slug, 'category')) { wp_insert_term($values[0], 'category', array('slug' => $slug, 'description' => $values[1])); }
    }
});

add_action('add_meta_boxes', function () { add_meta_box('mh-editorial', 'MotorHearts Editorial', 'mh_post_box', 'post', 'normal', 'high'); });
function mh_post_box($post) {
    wp_nonce_field('mh_save_post', 'mh_post_nonce');
    echo '<p>Choose how this story appears on the React website. Publish or update the post to save. Only published posts are displayed.</p>';
    foreach (array('hero' => 'Homepage cover story (one published story)', 'spotlight' => 'Editorial spotlight (one published story)', 'featured' => 'Featured story', 'guide' => 'Popular guide') as $key => $label) {
        echo '<p><label><input type="checkbox" name="mh_' . esc_attr($key) . '" value="1" ' . checked(get_post_meta($post->ID, '_mh_' . $key, true), '1', false) . '> ' . esc_html($label) . '</label></p>';
    }
    foreach (array('dek' => 'Dek / summary (optional; otherwise uses the WordPress excerpt)', 'pull_quote' => 'Pull quote (optional)') as $key => $label) {
        echo '<p><label for="mh_' . esc_attr($key) . '"><strong>' . esc_html($label) . '</strong></label><br><textarea class="widefat" rows="2" id="mh_' . esc_attr($key) . '" name="mh_' . esc_attr($key) . '">' . esc_textarea(get_post_meta($post->ID, '_mh_' . $key, true)) . '</textarea></p>';
    }
    foreach (array('read_time' => 'Reading time in minutes (0 = automatic)', 'featured_order' => 'Featured order (lowest number first)') as $key => $label) {
        echo '<p><label>' . esc_html($label) . ' <input type="number" min="0" name="mh_' . esc_attr($key) . '" value="' . esc_attr((int) get_post_meta($post->ID, '_mh_' . $key, true)) . '"></label></p>';
    }
    echo '<p><label for="mh_primary_category"><strong>Primary category</strong></label> <select name="mh_primary_category" id="mh_primary_category"><option value="0">First assigned category</option>';
    $selected = (int) get_post_meta($post->ID, '_mh_primary_category', true);
    foreach (get_categories(array('hide_empty' => false)) as $category) {
        echo '<option value="' . esc_attr($category->term_id) . '" ' . selected($selected, $category->term_id, false) . '>' . esc_html($category->name) . '</option>';
    }
    echo '</select><br>Also assign this category in the standard Categories panel.</p>';
    echo '<p><label for="mh_specs"><strong>Specifications</strong> — one per line: Power | 612 hp</label><textarea class="widefat" id="mh_specs" name="mh_specs" rows="5">' . esc_textarea(get_post_meta($post->ID, '_mh_specs', true)) . '</textarea></p>';
    echo '<p>Use the standard Featured image panel for story artwork, the post editor for the article body, and the Author selector for the byline. No React design settings are changed.</p>';
}
add_action('save_post_post', function ($id) {
    if (!isset($_POST['mh_post_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['mh_post_nonce'])), 'mh_save_post') || !current_user_can('edit_post', $id) || wp_is_post_autosave($id) || wp_is_post_revision($id)) { return; }
    foreach (array('hero', 'spotlight', 'featured', 'guide') as $key) {
        $value = isset($_POST['mh_' . $key]) ? '1' : '';
        update_post_meta($id, '_mh_' . $key, $value);
    }
    foreach (array('dek', 'pull_quote') as $key) { update_post_meta($id, '_mh_' . $key, isset($_POST['mh_' . $key]) ? sanitize_textarea_field(wp_unslash($_POST['mh_' . $key])) : ''); }
    foreach (array('read_time', 'featured_order', 'primary_category') as $key) { update_post_meta($id, '_mh_' . $key, isset($_POST['mh_' . $key]) ? absint($_POST['mh_' . $key]) : 0); }
    $specs = mh_specs(isset($_POST['mh_specs']) ? wp_unslash($_POST['mh_specs']) : '');
    update_post_meta($id, '_mh_specs', implode("\n", array_map(function ($spec) { return $spec['label'] . ' | ' . $spec['value']; }, $specs)));
    mh_exclusive($id);
});
function mh_exclusive($id) {
    if (get_post_status($id) !== 'publish') { return; }
    foreach (array('hero', 'spotlight') as $key) {
        if (!get_post_meta($id, '_mh_' . $key, true)) { continue; }
        $others = get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => -1, 'fields' => 'ids', 'post__not_in' => array($id), 'meta_key' => '_mh_' . $key, 'meta_value' => '1'));
        foreach ($others as $other) { update_post_meta($other, '_mh_' . $key, ''); }
    }
}
add_action('transition_post_status', function ($new, $old, $post) { if ($new === 'publish' && $post->post_type === 'post') { mh_exclusive($post->ID); } }, 10, 3);

function mh_image_input($value, $id = 'mh_image') {
    echo '<input type="url" class="regular-text" id="' . esc_attr($id) . '" name="mh_image" value="' . esc_attr($value) . '" placeholder="https://…"> <button type="button" class="button mh-select-image" data-target="' . esc_attr($id) . '">Choose image</button><p class="description">Select a Media Library image or enter an HTTPS image URL. Clear this field to use the website fallback.</p>';
}
add_action('category_add_form_fields', function () {
    echo '<div class="form-field"><label for="mh_image">MotorHearts category image</label>';
    wp_nonce_field('mh_save_category', 'mh_category_nonce');
    mh_image_input(''); echo '</div>';
});
add_action('category_edit_form_fields', function ($term) {
    echo '<tr class="form-field"><th><label for="mh_image">MotorHearts category image</label></th><td>';
    wp_nonce_field('mh_save_category', 'mh_category_nonce');
    mh_image_input(get_term_meta($term->term_id, '_mh_image', true)); echo '</td></tr>';
});
function mh_save_category($id) {
    if (!isset($_POST['mh_category_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['mh_category_nonce'])), 'mh_save_category') || !current_user_can('manage_categories')) { return; }
    update_term_meta($id, '_mh_image', isset($_POST['mh_image']) ? esc_url_raw(wp_unslash($_POST['mh_image']), array('https')) : '');
}
add_action('created_category', 'mh_save_category');
add_action('edited_category', 'mh_save_category');

function mh_profile($user) {
    echo '<h2>MotorHearts contributor</h2><table class="form-table"><tr><th><label for="mh_role">Editorial role</label></th><td>';
    wp_nonce_field('mh_save_profile', 'mh_profile_nonce');
    echo '<input class="regular-text" id="mh_role" name="mh_role" value="' . esc_attr(get_user_meta($user->ID, '_mh_role', true)) . '" placeholder="Road Test Editor"></td></tr><tr><th><label for="mh_image">Portrait</label></th><td>';
    mh_image_input(get_user_meta($user->ID, '_mh_image', true));
    echo '</td></tr></table><p>Use the standard Display name publicly as field for the byline and Biographical Info for the author archive. Profiles are shown only for authors with published posts.</p>';
}
add_action('show_user_profile', 'mh_profile');
add_action('edit_user_profile', 'mh_profile');
function mh_save_profile($id) {
    if (!isset($_POST['mh_profile_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['mh_profile_nonce'])), 'mh_save_profile') || !current_user_can('edit_user', $id)) { return; }
    update_user_meta($id, '_mh_role', isset($_POST['mh_role']) ? sanitize_text_field(wp_unslash($_POST['mh_role'])) : '');
    update_user_meta($id, '_mh_image', isset($_POST['mh_image']) ? esc_url_raw(wp_unslash($_POST['mh_image']), array('https')) : '');
}
add_action('personal_options_update', 'mh_save_profile');
add_action('edit_user_profile_update', 'mh_save_profile');

add_action('admin_enqueue_scripts', function ($hook) {
    if (!in_array($hook, array('edit-tags.php', 'term.php', 'profile.php', 'user-edit.php'), true)) { return; }
    wp_enqueue_media();
    wp_enqueue_script('jquery');
    wp_add_inline_script('jquery', 'jQuery(function($){$(document).on("click",".mh-select-image",function(e){e.preventDefault();var target=$("#"+$(this).data("target"));var picker=wp.media({title:"MotorHearts artwork",library:{type:"image"},multiple:false});picker.on("select",function(){target.val(picker.state().get("selection").first().toJSON().url).trigger("change");});picker.open();});});');
});
