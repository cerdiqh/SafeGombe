import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Flag, 
  Search,
  Plus,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    reputation: number;
    badge?: string;
  };
  category: 'general' | 'safety-tips' | 'incident-discussion' | 'community-watch' | 'questions';
  location?: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: number;
  isResolved?: boolean;
  isPinned?: boolean;
  tags: string[];
}

interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    reputation: number;
  };
  timestamp: string;
  likes: number;
  dislikes: number;
  isAnswer?: boolean;
}

const mockPosts: ForumPost[] = [
  {
    id: 'post-1',
    title: 'Safety Tips for Walking at Night in Gombe Central',
    content: 'I\'ve been living in Gombe Central for 5 years and wanted to share some safety tips for those who need to walk at night. Always stick to well-lit main roads, avoid shortcuts through alleys, and consider using the Safe Walk feature in this app.',
    author: {
      id: 'user-1',
      name: 'SafetyExpert',
      reputation: 1250,
      badge: 'Community Leader'
    },
    category: 'safety-tips',
    location: 'Gombe Central',
    timestamp: '2024-02-15T10:30:00Z',
    likes: 45,
    dislikes: 2,
    replies: 12,
    isPinned: true,
    tags: ['night-safety', 'gombe-central', 'walking']
  },
  {
    id: 'post-2',
    title: 'Suspicious Activity Near Billiri Market - Community Alert',
    content: 'Has anyone else noticed increased suspicious activity near Billiri Market in the evenings? I\'ve reported it through the app but wanted to check if others have similar observations.',
    author: {
      id: 'user-2',
      name: 'CommunityWatcher',
      reputation: 890,
      badge: 'Verified Reporter'
    },
    category: 'community-watch',
    location: 'Billiri',
    timestamp: '2024-02-14T16:45:00Z',
    likes: 23,
    dislikes: 1,
    replies: 8,
    tags: ['billiri', 'suspicious-activity', 'market']
  },
  {
    id: 'post-3',
    title: 'How to Use the Panic Button Effectively?',
    content: 'I just downloaded the app and I\'m wondering about the best practices for using the panic button. When should I use it vs calling 199 directly?',
    author: {
      id: 'user-3',
      name: 'NewUser123',
      reputation: 50
    },
    category: 'questions',
    timestamp: '2024-02-14T14:20:00Z',
    likes: 15,
    dislikes: 0,
    replies: 6,
    isResolved: true,
    tags: ['panic-button', 'help', 'emergency']
  }
];

const mockComments: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-3',
    content: 'Great question! The panic button is best for situations where you need immediate help but can\'t make a phone call safely. It sends your location to both emergency services and your emergency contacts automatically.',
    author: {
      id: 'user-1',
      name: 'SafetyExpert',
      reputation: 1250
    },
    timestamp: '2024-02-14T15:00:00Z',
    likes: 12,
    dislikes: 0,
    isAnswer: true
  },
  {
    id: 'comment-2',
    postId: 'post-3',
    content: 'I used it once when I felt I was being followed. It worked perfectly - help arrived within 10 minutes and my family was notified immediately.',
    author: {
      id: 'user-4',
      name: 'GratefulUser',
      reputation: 320
    },
    timestamp: '2024-02-14T15:30:00Z',
    likes: 8,
    dislikes: 0
  }
];

const PostCard = ({ post, onClick }: { post: ForumPost; onClick: () => void }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety-tips': return 'bg-green-100 text-green-800';
      case 'incident-discussion': return 'bg-red-100 text-red-800';
      case 'community-watch': return 'bg-blue-100 text-blue-800';
      case 'questions': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuthorBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Community Leader': return 'bg-yellow-100 text-yellow-800';
      case 'Verified Reporter': return 'bg-blue-100 text-blue-800';
      case 'Safety Expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {post.isPinned && <Badge variant="outline" className="text-xs">📌 Pinned</Badge>}
            <Badge className={`text-xs ${getCategoryColor(post.category)}`}>
              {post.category.replace('-', ' ')}
            </Badge>
            {post.isResolved && <Badge variant="outline" className="text-xs text-green-600">✓ Resolved</Badge>}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(post.timestamp).toLocaleDateString()}
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">{post.author.name}</span>
                {post.author.badge && (
                  <Badge variant="outline" className={`text-xs ${getAuthorBadgeColor(post.author.badge)}`}>
                    {post.author.badge}
                  </Badge>
                )}
              </div>
            </div>
            {post.location && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {post.location}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.replies}</span>
            </div>
          </div>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CommentCard = ({ comment }: { comment: Comment }) => (
  <div className={`p-4 border rounded-lg ${comment.isAnswer ? 'bg-green-50 border-green-200' : ''}`}>
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center space-x-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm">{comment.author.name}</span>
        <span className="text-xs text-muted-foreground">
          {new Date(comment.timestamp).toLocaleDateString()}
        </span>
        {comment.isAnswer && (
          <Badge variant="outline" className="text-xs text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Best Answer
          </Badge>
        )}
      </div>
    </div>
    
    <p className="text-sm mb-3">{comment.content}</p>
    
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="sm" className="h-auto p-1">
        <ThumbsUp className="h-3 w-3 mr-1" />
        {comment.likes}
      </Button>
      <Button variant="ghost" size="sm" className="h-auto p-1">
        <Reply className="h-3 w-3 mr-1" />
        Reply
      </Button>
      <Button variant="ghost" size="sm" className="h-auto p-1">
        <Flag className="h-3 w-3 mr-1" />
        Report
      </Button>
    </div>
  </div>
);

const PostDetail = ({ post, onBack }: { post: ForumPost; onBack: () => void }) => {
  const [newComment, setNewComment] = useState('');
  const [comments] = useState(mockComments.filter(c => c.postId === post.id));

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // In a real app, this would submit to the backend
      console.log('Submitting comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="px-0">
        ← Back to Forum
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {post.isPinned && <Badge variant="outline">📌 Pinned</Badge>}
                <Badge className="bg-green-100 text-green-800">
                  {post.category.replace('-', ' ')}
                </Badge>
                {post.isResolved && <Badge variant="outline" className="text-green-600">✓ Resolved</Badge>}
              </div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{post.author.name}</span>
                  {post.author.badge && (
                    <Badge variant="outline" className="text-xs">
                      {post.author.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{post.author.reputation} reputation</span>
                  <span>•</span>
                  <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                  {post.location && (
                    <>
                      <span>•</span>
                      <MapPin className="h-3 w-3" />
                      <span>{post.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{post.content}</p>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t">
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-4 w-4 mr-2" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsDown className="h-4 w-4 mr-2" />
              {post.dislikes}
            </Button>
            <Button variant="ghost" size="sm">
              <Flag className="h-4 w-4 mr-2" />
              Report
            </Button>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or ask a question..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function CommunityForum() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [posts] = useState<ForumPost[]>(mockPosts);
  const { toast } = useToast();

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || post.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  if (selectedPost) {
    return <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Users className="h-8 w-8 mr-3 text-blue-600" />
          Community Forum
        </h1>
        <p className="text-muted-foreground">
          Connect with your community, share safety tips, and discuss local security matters
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search discussions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={() => setShowNewPost(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="safety-tips">Safety Tips</TabsTrigger>
          <TabsTrigger value="community-watch">Watch</TabsTrigger>
          <TabsTrigger value="incident-discussion">Incidents</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <div className="grid gap-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={() => setSelectedPost(post)} 
              />
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <MessageSquare className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">No discussions found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to start a conversation in this category.
              </p>
              <Button onClick={() => setShowNewPost(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </div>
          )}
        </div>
      </Tabs>

      {/* Community Stats Sidebar */}
      <div className="grid gap-6 md:grid-cols-3 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-sm text-muted-foreground">Discussions Today</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">456</div>
            <div className="text-sm text-muted-foreground">Safety Tips Shared</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
