import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Heart, 
  Shield, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Users,
  Lightbulb,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

interface SafetyTip {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'travel' | 'emergency' | 'cyber' | 'personal';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  steps?: string[];
}

interface FirstAidGuide {
  id: string;
  title: string;
  description: string;
  urgency: 'critical' | 'urgent' | 'moderate';
  steps: string[];
  warnings?: string[];
  whenToCall911: string[];
}

const safetyTips: SafetyTip[] = [
  {
    id: 'tip-1',
    title: 'Personal Safety Awareness',
    description: 'Essential tips for staying safe in public spaces',
    category: 'personal',
    difficulty: 'beginner',
    readTime: '3 min',
    steps: [
      'Always be aware of your surroundings',
      'Trust your instincts - if something feels wrong, leave',
      'Keep your phone charged and easily accessible',
      'Avoid displaying expensive items in public',
      'Walk confidently and make eye contact with others'
    ]
  },
  {
    id: 'tip-2',
    title: 'Safe Travel in Gombe',
    description: 'Navigate Gombe State safely with local knowledge',
    category: 'travel',
    difficulty: 'intermediate',
    readTime: '5 min',
    steps: [
      'Research your route before traveling',
      'Avoid traveling alone at night, especially in remote areas',
      'Keep emergency contacts readily available',
      'Inform someone of your travel plans and expected arrival',
      'Use main roads and avoid shortcuts through unfamiliar areas',
      'Keep vehicle doors locked and windows up in high-risk areas'
    ]
  },
  {
    id: 'tip-3',
    title: 'Cybersecurity Basics',
    description: 'Protect yourself from digital threats',
    category: 'cyber',
    difficulty: 'beginner',
    readTime: '4 min',
    steps: [
      'Use strong, unique passwords for all accounts',
      'Enable two-factor authentication where possible',
      'Be cautious of public Wi-Fi networks',
      'Don\'t share personal information on social media',
      'Verify sender identity before clicking links or attachments'
    ]
  },
  {
    id: 'tip-4',
    title: 'Emergency Preparedness',
    description: 'Be ready for unexpected situations',
    category: 'emergency',
    difficulty: 'intermediate',
    readTime: '6 min',
    steps: [
      'Create an emergency contact list',
      'Keep a basic first aid kit accessible',
      'Know the locations of nearest hospitals and police stations',
      'Have backup communication methods',
      'Keep important documents in a safe, accessible place',
      'Maintain emergency supplies (water, flashlight, batteries)'
    ]
  }
];

const firstAidGuides: FirstAidGuide[] = [
  {
    id: 'cpr',
    title: 'CPR (Cardiopulmonary Resuscitation)',
    description: 'Life-saving technique for cardiac arrest',
    urgency: 'critical',
    steps: [
      'Check for responsiveness - tap shoulders and shout "Are you okay?"',
      'Call for help immediately - dial 199 or ask someone else to do it',
      'Position the person on their back on a firm surface',
      'Tilt head back slightly and lift chin to open airway',
      'Place heel of one hand on center of chest, between nipples',
      'Place other hand on top, interlacing fingers',
      'Push hard and fast at least 2 inches deep',
      'Allow complete chest recoil between compressions',
      'Compress at rate of 100-120 per minute',
      'Continue until emergency services arrive'
    ],
    warnings: [
      'Only perform if person is unresponsive and not breathing normally',
      'Do not stop CPR unless emergency services take over'
    ],
    whenToCall911: [
      'Person is unconscious and not breathing',
      'No pulse can be detected',
      'Person is blue or gray in color'
    ]
  },
  {
    id: 'choking',
    title: 'Choking Response',
    description: 'Help someone who is choking',
    urgency: 'critical',
    steps: [
      'Ask "Are you choking?" - if they can speak, encourage coughing',
      'If they cannot speak or breathe, stand behind them',
      'Place arms around their waist',
      'Make a fist with one hand, place thumb side against stomach above navel',
      'Grasp fist with other hand and give quick upward thrusts',
      'Continue until object is expelled or person becomes unconscious',
      'If unconscious, begin CPR and call emergency services'
    ],
    warnings: [
      'Do not hit person on the back if they are conscious',
      'Be careful not to push object further down'
    ],
    whenToCall911: [
      'Person cannot breathe, speak, or cough',
      'Person becomes unconscious',
      'Object cannot be removed'
    ]
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding Control',
    description: 'Stop severe bleeding and prevent shock',
    urgency: 'urgent',
    steps: [
      'Call emergency services immediately',
      'Put on gloves if available to protect yourself',
      'Remove any visible debris, but not objects stuck in wound',
      'Apply direct pressure with clean cloth or bandage',
      'If blood soaks through, add more layers without removing first',
      'Elevate injured area above heart level if possible',
      'Apply pressure to pressure points if bleeding continues',
      'Monitor for signs of shock (pale, cold, rapid pulse)'
    ],
    warnings: [
      'Do not remove objects embedded in wounds',
      'Do not use tourniquet unless trained'
    ],
    whenToCall911: [
      'Bleeding cannot be controlled with direct pressure',
      'Signs of shock are present',
      'Large or deep wounds'
    ]
  }
];

const TipCard = ({ tip, onClick }: { tip: SafetyTip; onClick: () => void }) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{tip.title}</h3>
        <Badge variant={tip.difficulty === 'beginner' ? 'default' : tip.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
          {tip.difficulty}
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm mb-3">{tip.description}</p>
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="text-xs">
          {tip.category}
        </Badge>
        <span className="text-xs text-muted-foreground">{tip.readTime}</span>
      </div>
    </CardContent>
  </Card>
);

const FirstAidCard = ({ guide, onClick }: { guide: FirstAidGuide; onClick: () => void }) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{guide.title}</h3>
        <Badge variant={guide.urgency === 'critical' ? 'destructive' : guide.urgency === 'urgent' ? 'secondary' : 'default'}>
          {guide.urgency}
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm">{guide.description}</p>
    </CardContent>
  </Card>
);

const TipDetail = ({ tip, onBack }: { tip: SafetyTip; onBack: () => void }) => (
  <div className="space-y-6">
    <Button variant="ghost" onClick={onBack} className="px-0">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Tips
    </Button>
    
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{tip.title}</CardTitle>
            <p className="text-muted-foreground mt-1">{tip.description}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={tip.difficulty === 'beginner' ? 'default' : tip.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
              {tip.difficulty}
            </Badge>
            <Badge variant="outline">{tip.readTime}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {tip.steps && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Steps to Follow
            </h3>
            <ol className="space-y-2">
              {tip.steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

const FirstAidDetail = ({ guide, onBack }: { guide: FirstAidGuide; onBack: () => void }) => (
  <div className="space-y-6">
    <Button variant="ghost" onClick={onBack} className="px-0">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to First Aid
    </Button>
    
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <Heart className="h-6 w-6 mr-2 text-red-500" />
              {guide.title}
            </CardTitle>
            <p className="text-muted-foreground mt-1">{guide.description}</p>
          </div>
          <Badge variant={guide.urgency === 'critical' ? 'destructive' : guide.urgency === 'urgent' ? 'secondary' : 'default'}>
            {guide.urgency}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {guide.warnings && guide.warnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Important Warnings
            </h4>
            <ul className="space-y-1">
              {guide.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-700 text-sm">• {warning}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Step-by-Step Instructions
          </h3>
          <ol className="space-y-3">
            {guide.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 flex items-center mb-2">
            <Phone className="h-5 w-5 mr-2" />
            When to Call Emergency Services (199)
          </h4>
          <ul className="space-y-1">
            {guide.whenToCall911.map((situation, index) => (
              <li key={index} className="text-red-700 text-sm">• {situation}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function EducationalContent() {
  const [activeTab, setActiveTab] = useState('tips');
  const [selectedTip, setSelectedTip] = useState<SafetyTip | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<FirstAidGuide | null>(null);

  if (selectedTip) {
    return <TipDetail tip={selectedTip} onBack={() => setSelectedTip(null)} />;
  }

  if (selectedGuide) {
    return <FirstAidDetail guide={selectedGuide} onBack={() => setSelectedGuide(null)} />;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
          Safety Education Center
        </h1>
        <p className="text-muted-foreground">
          Learn essential safety skills and emergency procedures to protect yourself and others
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tips" className="flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Safety Tips
          </TabsTrigger>
          <TabsTrigger value="firstaid" className="flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            First Aid
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            Emergency Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tips" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {safetyTips.map((tip) => (
              <TipCard 
                key={tip.id} 
                tip={tip} 
                onClick={() => setSelectedTip(tip)} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="firstaid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {firstAidGuides.map((guide) => (
              <FirstAidCard 
                key={guide.id} 
                guide={guide} 
                onClick={() => setSelectedGuide(guide)} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-red-500" />
                  Emergency Numbers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Police Emergency</span>
                  <span className="font-bold text-red-600">199</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Operation Hattara</span>
                  <span className="font-bold text-blue-600">123</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Medical Emergency</span>
                  <span className="font-bold text-green-600">199</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium">Fire Service</span>
                  <span className="font-bold text-orange-600">199</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  Key Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium">Gombe General Hospital</div>
                  <div className="text-sm text-muted-foreground">Main emergency medical facility</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium">Gombe Central Police Station</div>
                  <div className="text-sm text-muted-foreground">Primary police headquarters</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium">Operation Hattara Command</div>
                  <div className="text-sm text-muted-foreground">Special security taskforce</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
