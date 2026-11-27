export const GUIDES_CATEGORY_SLUG = "guides";

type CategoryReference = { id: string; slug: string };
type StoryReference = { categoryId: string; categoryIds?: string[] };

export function isGuideStory(story: StoryReference, categories: CategoryReference[]) {
  const guideCategory = categories.find(category => category.slug === GUIDES_CATEGORY_SLUG);
  if (!guideCategory) return false;
  return story.categoryIds?.includes(guideCategory.id) ?? story.categoryId === guideCategory.id;
}
