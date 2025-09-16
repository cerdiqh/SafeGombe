import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Users, 
  TrendingUp,
  Medal,
  Crown,
  Shield,
  Zap,
  Gift,
  Calendar
} from 'lucide-react';

interface UserStats {
  userId: string;
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalReports: number;
  verifiedReports: number;
  safeWalksCompleted: number;
  helpedOthers: number;
  streak: number;
  badges: Badge[];
  rank: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  totalContributions: number;
  badges: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  category: 'reporting' | 'safety' | 'community' | 'education';
}

const mockUserStats: UserStats = {
  userId: 'user-123',
  username: 'SafetyHero',
  level: 12,
  xp: 2450,
  xpToNextLevel: 550,
  totalReports: 23,
  verifiedReports: 19,
  safeWalksCompleted: 8,
  helpedOthers: 15,
  streak: 7,
  rank: 3,
  badges: [
    {
      id: 'reporter',
      name: 'Community Reporter',
      description: 'Submitted 10 verified incident reports',
      icon: '📝',
      rarity: 'common',
      unlockedAt: '2024-01-15'
    },
    {
      id: 'guardian',
      name: 'Safety Guardian',
      description: 'Completed 5 safe walks',
      icon: '🛡️',
      rarity: 'rare',
      unlockedAt: '2024-02-01'
    },
    {
      id: 'streak',
      name: 'Streak Master',
      description: 'Maintained 7-day activity streak',
      icon: '🔥',
      rarity: 'epic',
      unlockedAt: '2024-02-10'
    }
  ]
};

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'SafetyChampion', level: 18, xp: 4250, totalContributions: 45, badges: 12 },
  { rank: 2, username: 'CommunityGuard', level: 15, xp: 3800, totalContributions: 38, badges: 9 },
  { rank: 3, username: 'SafetyHero', level: 12, xp: 2450, totalContributions: 31, badges: 7 },
  { rank: 4, username: 'ProtectorPro', level: 11, xp: 2200, totalContributions: 28, badges: 6 },
  { rank: 5, username: 'AlertAngel', level: 10, xp: 1950, totalContributions: 25, badges: 5 },
];

const mockAchievements: Achievement[] = [
  {
    id: 'first-report',
    title: 'First Report',
    description: 'Submit your first incident report',
    xpReward: 100,
    progress: 1,
    maxProgress: 1,
    completed: true,
    category: 'reporting'
  },
  {
    id: 'verified-reporter',
    title: 'Verified Reporter',
    description: 'Get 20 reports verified by authorities',
    xpReward: 500,
    progress: 19,
    maxProgress: 20,
    completed: false,
    category: 'reporting'
  },
  {
    id: 'safe-walker',
    title: 'Safe Walker',
    description: 'Complete 10 safe walks',
    xpReward: 300,
    progress: 8,
    maxProgress: 10,
    completed: false,
    category: 'safety'
  },
  {
    id: 'community-helper',
    title: 'Community Helper',
    description: 'Help 20 community members',
    xpReward: 400,
    progress: 15,
    maxProgress: 20,
    completed: false,
    category: 'community'
  }
];

const BadgeCard = ({ badge }: { badge: Badge }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className={`border-2 ${getRarityColor(badge.rarity)}`}>
      <CardContent className="p-4 text-center">
        <div className="text-4xl mb-2">{badge.icon}</div>
        <h3 className="font-semibold text-sm">{badge.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
        <Badge variant="outline" className="mt-2 text-xs">
          {badge.rarity}
        </Badge>
      </CardContent>
    </Card>
  );
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reporting': return <Target className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      case 'education': return <Award className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <Card className={achievement.completed ? 'border-green-200 bg-green-50' : ''}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(achievement.category)}
            <h3 className="font-semibold">{achievement.title}</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span className="text-sm font-medium">{achievement.xpReward} XP</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{achievement.progress}/{achievement.maxProgress}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {achievement.completed && (
          <Badge variant="default" className="mt-2 bg-green-600">
            <Award className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

const LeaderboardRow = ({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser?: boolean }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${isCurrentUser ? 'bg-blue-50 border-blue-200' : ''}`}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-8">
          {getRankIcon(entry.rank)}
        </div>
        <div>
          <div className="font-semibold flex items-center">
            {entry.username}
            {isCurrentUser && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
          </div>
          <div className="text-sm text-muted-foreground">
            Level {entry.level} • {entry.totalContributions} contributions
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-semibold">{entry.xp.toLocaleString()} XP</div>
        <div className="text-sm text-muted-foreground">{entry.badges} badges</div>
      </div>
    </div>
  );
};

export default function GamificationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats] = useState<UserStats>(mockUserStats);

  const levelProgress = (userStats.xp / (userStats.xp + userStats.xpToNextLevel)) * 100;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Trophy className="h-8 w-8 mr-3 text-yellow-600" />
          Community Rewards
        </h1>
        <p className="text-muted-foreground">
          Earn points, unlock badges, and climb the leaderboard by keeping your community safe
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.level}</div>
            <div className="text-sm text-muted-foreground">Level</div>
            <Progress value={levelProgress} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {userStats.xpToNextLevel} XP to next level
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.totalReports}</div>
            <div className="text-sm text-muted-foreground">Reports Submitted</div>
            <div className="text-xs text-green-600 mt-1">
              {userStats.verifiedReports} verified
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">#{userStats.rank}</div>
            <div className="text-sm text-muted-foreground">Leaderboard Rank</div>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">Rising</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
            <div className="flex items-center justify-center mt-1">
              <Calendar className="h-3 w-3 text-orange-500 mr-1" />
              <span className="text-xs text-orange-600">Keep it up!</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockAchievements.filter(a => a.completed).slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-purple-500" />
                  Weekly Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Submit 3 Reports</span>
                    <Badge variant="outline">2/3</Badge>
                  </div>
                  <Progress value={66} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">Reward: 200 XP</div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Complete 2 Safe Walks</span>
                    <Badge variant="outline">1/2</Badge>
                  </div>
                  <Progress value={50} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">Reward: 150 XP</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {userStats.badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Community Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockLeaderboard.map((entry) => (
                <LeaderboardRow 
                  key={entry.rank} 
                  entry={entry} 
                  isCurrentUser={entry.username === userStats.username}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
