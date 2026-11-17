import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Article from "./pages/Article";
import NotFound from "./pages/NotFound";
import Editor from "./pages/Editor";
import InfoPage from "./pages/InfoPages";
import { ArticlesArchive, AuthorArchive, AuthorsIndex, CategoryArchive, GuidesArchive } from "./pages/Archives";
import { ContentProvider } from "./lib/ContentContext";
import BrandIcons from "./components/BrandIcons";

const queryClient = new QueryClient();
const App = () => <QueryClientProvider client={queryClient}><TooltipProvider><BrandIcons /><Toaster /><Sonner /><ContentProvider><BrowserRouter><Routes>
  <Route path="/" element={<Index />} />
  <Route path="/article/:slug" element={<Article />} />
  <Route path="/category/:slug" element={<CategoryArchive />} />
  <Route path="/articles" element={<ArticlesArchive />} />
  <Route path="/guides" element={<GuidesArchive />} />
  <Route path="/authors" element={<AuthorsIndex />} />
  <Route path="/author/:slug" element={<AuthorArchive />} />
  <Route path="/about" element={<InfoPage kind="about" />} />
  <Route path="/editorial-policy" element={<InfoPage kind="editorial" />} />
  <Route path="/privacy-policy" element={<InfoPage kind="privacy" />} />
  <Route path="/editor" element={<Editor />} />
  <Route path="*" element={<NotFound />} />
</Routes></BrowserRouter></ContentProvider></TooltipProvider></QueryClientProvider>;
export default App;
