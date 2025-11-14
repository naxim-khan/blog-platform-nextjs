"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, FileText, Eye, Tag, Image, FolderOpen, Sparkles, Clock, Globe, CheckCircle } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/editor/RichTextEditor";

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "Technology",
    published: false
  });

  const categories = [
    "Technology",
    "Lifestyle",
    "Travel",
    "Food",
    "Health & Wellness",
    "Business",
    "Entertainment",
    "Education",
    "Science",
    "Arts & Culture"
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tags
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      router.push('/dashboard/posts');
    } catch (err) {
      console.error('Error creating post:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.content.trim();

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-5 px-3 sm:px-4 lg:px-6">
      {/* Enhanced Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <Link href="/dashboard/posts" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              Back
            </Button>
          </Link>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                Create New Post
              </h1>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm truncate">
              Craft and publish amazing content for your audience
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end mt-3 sm:mt-0">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            Preview
          </Button>
          <Button 
            type="submit" 
            form="post-form"
            disabled={loading || !isFormValid}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <Save className="h-3 w-3 sm:h-4 sm:w-4" />
            {loading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <form id="post-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Content - Enhanced */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Enhanced Content Card */}
            <Card className="border border-gray-200 bg-white/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg font-bold text-gray-900 truncate">Post Content</CardTitle>
                    <CardDescription className="text-gray-600 text-xs sm:text-sm">
                      Write engaging content that captures your audience's attention
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 px-3 sm:px-4 lg:px-6">
                {/* Title Section */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">Post Title</Label>
                    <span className="text-xs text-gray-500">Required</span>
                  </div>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Write a catchy title that grabs attention..."
                    className="text-base sm:text-lg font-medium border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Excerpt Section */}
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    placeholder="Brief description that appears in post previews and search results..."
                    rows={2}
                    className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      A good excerpt improves click-through rates
                    </p>
                    <p className={`text-xs ${formData.excerpt.length > 300 ? 'text-red-500' : 'text-gray-500'}`}>
                      {formData.excerpt.length}/300
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content" className="text-sm font-medium text-gray-700">Content</Label>
                    <span className="text-xs text-gray-500">Required</span>
                  </div>
                  <div className="border border-gray-300 rounded-lg overflow-hidden min-h-[200px] sm:min-h-[300px]">
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => handleChange('content', content)}
                      placeholder="Start writing your amazing content here..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Enhanced Publish Settings */}
            <Card className="border border-gray-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <CardTitle className="text-sm sm:text-base font-semibold text-gray-900">Publish Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 pt-3 sm:pt-4 px-4 sm:px-6">
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50/50">
                  <div className="space-y-0.5 sm:space-y-1">
                    <Label htmlFor="published" className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">
                      Publish Status
                    </Label>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {formData.published ? (
                        <>
                          <Globe className="h-3 w-3" />
                          Visible to public
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" />
                          Save as draft
                        </>
                      )}
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleChange('published', checked)}
                    className="data-[state=checked]:bg-green-600 scale-90 sm:scale-100"
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="category" className="text-xs sm:text-sm font-medium text-gray-700">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm">
                      <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category} className="focus:bg-blue-50 text-xs sm:text-sm">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Featured Image */}
            <Card className="border border-gray-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <CardTitle className="text-sm sm:text-base font-semibold text-gray-900">Featured Image</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 px-4 sm:px-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="featuredImage" className="text-xs sm:text-sm font-medium text-gray-700">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="featuredImage"
                      value={formData.featuredImage}
                      onChange={(e) => handleChange('featuredImage', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm"
                    />
                    <Button type="button" variant="outline" size="sm" className="shrink-0 border-gray-300 hover:bg-gray-50 px-2 sm:px-3">
                      <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
                
                {formData.featuredImage && (
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden transition-all duration-300 hover:border-blue-400">
                    <img 
                      src={formData.featuredImage} 
                      alt="Featured preview" 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Tags */}
            <Card className="border border-gray-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2 sm:pb-2 border-b border-gray-100 px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <CardTitle className="text-sm sm:text-base font-semibold text-gray-900">Tags</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 pt-2 px-4 sm:px-6">
                <div className="space-y-1">
                  <Label htmlFor="tags" className="text-xs sm:text-sm font-medium text-gray-700">Add Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tags..."
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddTag} 
                      className="shrink-0 border-gray-300 hover:bg-gray-50 px-2 sm:px-3"
                      disabled={!tagInput.trim()}
                    >
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Press Enter or click the tag icon to add
                  </p>
                </div>
                
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-1 py-1 px-2 sm:py-1.5 sm:px-3 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors text-xs sm:text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-500 transition-colors ml-1 text-blue-600 hover:text-red-600 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 sm:py-4 text-gray-500">
                    <Tag className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 opacity-50" />
                    <p className="text-xs sm:text-sm">No tags added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Width Post Summary at the End - Mobile Optimized */}
        <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm mt-4 sm:mt-6 mx-2 sm:mx-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              {/* Left Side - Summary Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-blue-900">Post Summary</h3>
                    <p className="text-xs sm:text-sm text-blue-700">
                      Review your post details before publishing
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Status */}
                  <div className="text-center p-3 sm:p-4 rounded-lg bg-white/50 border border-blue-100">
                    <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1 sm:mb-2">Status</p>
                    <Badge className={
                      formData.published 
                        ? "bg-green-100 text-green-800 border-green-200 px-2 py-0.5 sm:px-3 sm:py-1 text-xs" 
                        : "bg-gray-100 text-gray-800 border-gray-200 px-2 py-0.5 sm:px-3 sm:py-1 text-xs"
                    }>
                      {formData.published ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  {/* Category */}
                  <div className="text-center p-3 sm:p-4 rounded-lg bg-white/50 border border-blue-100">
                    <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1 sm:mb-2">Category</p>
                    <p className="text-sm sm:text-lg font-semibold text-blue-900 truncate">{formData.category}</p>
                  </div>

                  {/* Tags Count */}
                  <div className="text-center p-3 sm:p-4 rounded-lg bg-white/50 border border-blue-100">
                    <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1 sm:mb-2">Tags</p>
                    <p className="text-sm sm:text-lg font-semibold text-blue-900">
                      {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
                    </p>
                  </div>
                </div>

                {/* Tags List */}
                {tags.length > 0 && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg bg-white/50 border border-blue-100">
                    <p className="text-xs sm:text-sm font-medium text-blue-700 mb-2 sm:mb-3">Current Tags</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="text-xs sm:text-sm bg-white text-blue-700 px-2 py-1 sm:px-3 sm:py-2 rounded-lg border border-blue-200 shadow-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Quick Stats */}
              <div className="lg:w-64 space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 rounded-lg bg-white/70 border border-blue-100">
                  <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2 sm:mb-3">Quick Stats</h4>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-blue-700">Title Length:</span>
                      <span className={`text-xs sm:text-sm font-medium ${formData.title.length > 60 ? 'text-green-600' : 'text-blue-600'}`}>
                        {formData.title.length}/60
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-blue-700">Excerpt Length:</span>
                      <span className={`text-xs sm:text-sm font-medium ${formData.excerpt.length > 300 ? 'text-red-600' : 'text-blue-600'}`}>
                        {formData.excerpt.length}/300
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-blue-700">Content:</span>
                      <span className={`text-xs sm:text-sm font-medium ${formData.content.length > 100 ? 'text-green-600' : 'text-amber-600'}`}>
                        {formData.content.length > 0 ? 'Added' : 'Empty'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-blue-700">Featured Image:</span>
                      <span className={`text-xs sm:text-sm font-medium ${formData.featuredImage ? 'text-green-600' : 'text-gray-600'}`}>
                        {formData.featuredImage ? 'Added' : 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Publish Button */}
                <Button 
                  type="submit" 
                  form="post-form"
                  disabled={loading || !isFormValid}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed py-2 sm:py-3 text-sm sm:text-base"
                >
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  {loading ? "Publishing..." : "Publish Post"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}