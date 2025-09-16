import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Languages, 
  Play, 
  Square,
  Globe,
  Headphones
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface Translation {
  [key: string]: {
    [key: string]: string;
  };
}

const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

const translations: Translation = {
  en: {
    'emergency': 'Emergency',
    'report_incident': 'Report Incident',
    'safe_walk': 'Safe Walk',
    'panic_button': 'Panic Button',
    'help': 'Help',
    'location': 'Location',
    'description': 'Description',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'speak_now': 'Speak now...',
    'listening': 'Listening...',
    'voice_input': 'Voice Input',
    'text_input': 'Text Input',
    'translate': 'Translate',
    'emergency_contacts': 'Emergency Contacts',
    'police': 'Police',
    'ambulance': 'Ambulance',
    'fire_service': 'Fire Service',
    'safety_tips': 'Safety Tips',
    'stay_safe': 'Stay safe and be aware of your surroundings',
    'call_for_help': 'Call for help if you feel unsafe',
    'trust_instincts': 'Trust your instincts',
  },
  ha: {
    'emergency': 'Gaggawa',
    'report_incident': 'Bayar da Lamari',
    'safe_walk': 'Tafiya Mai Aminci',
    'panic_button': 'Maballin Tsoro',
    'help': 'Taimako',
    'location': 'Wuri',
    'description': 'Bayanin',
    'submit': 'Aika',
    'cancel': 'Soke',
    'speak_now': 'Yi magana yanzu...',
    'listening': 'Ina saurare...',
    'voice_input': 'Shigar da Murya',
    'text_input': 'Shigar da Rubutu',
    'translate': 'Fassara',
    'emergency_contacts': 'Lambobin Gaggawa',
    'police': 'Yan Sanda',
    'ambulance': 'Motar Asibiti',
    'fire_service': 'Ma\'aikatan Kashe Gobara',
    'safety_tips': 'Shawarwarin Aminci',
    'stay_safe': 'Ku kasance cikin aminci kuma ku lura da kewayen ku',
    'call_for_help': 'Ku kira don neman taimako idan kun ji rashin lafiya',
    'trust_instincts': 'Ku amince da tunanin ku',
  },
  yo: {
    'emergency': 'Pajawiri',
    'report_incident': 'Ro Iṣẹlẹ',
    'safe_walk': 'Irin Ailabu',
    'panic_button': 'Bọtini Ẹru',
    'help': 'Iranlọwọ',
    'location': 'Ipo',
    'description': 'Apejuwe',
    'submit': 'Fi silẹ',
    'cancel': 'Fagilee',
    'speak_now': 'Sọrọ bayi...',
    'listening': 'N gbọ...',
    'voice_input': 'Titẹ Ohun sinu',
    'text_input': 'Titẹ Ọrọ sinu',
    'translate': 'Tumọ',
    'emergency_contacts': 'Awọn Nọmba Pajawiri',
    'police': 'Ọlọpa',
    'ambulance': 'Ọkọ Iwosan',
    'fire_service': 'Awọn Oṣiṣẹ Ina',
    'safety_tips': 'Awọn Imọran Ailabu',
    'stay_safe': 'Wa ni ailabu ki o si mọ ohun ti o wa ni ayika rẹ',
    'call_for_help': 'Pe fun iranlọwọ ti o ba ni rilara ailabu',
    'trust_instincts': 'Gbẹkẹle awọn ifọkansi rẹ',
  },
  ig: {
    'emergency': 'Ihe Mberede',
    'report_incident': 'Kọọ Ihe Mere',
    'safe_walk': 'Ije Nchekwa',
    'panic_button': 'Bọtịn Ụjọ',
    'help': 'Enyemaka',
    'location': 'Ebe',
    'description': 'Nkọwa',
    'submit': 'Ziga',
    'cancel': 'Kagbuo',
    'speak_now': 'Kwuo ugbu a...',
    'listening': 'Na-ege ntị...',
    'voice_input': 'Ntinye Olu',
    'text_input': 'Ntinye Edemede',
    'translate': 'Tụgharịa',
    'emergency_contacts': 'Nọmba Ihe Mberede',
    'police': 'Ndị Uwe Ojii',
    'ambulance': 'Ụgbọ Ọrịa',
    'fire_service': 'Ndị Ọrụ Ọkụ',
    'safety_tips': 'Ndụmọdụ Nchekwa',
    'stay_safe': 'Nọrọ na nchekwa ma mara ihe gbara gị gburugburu',
    'call_for_help': 'Kpọọ maka enyemaka ma ọ bụrụ na ị na-enwe mmetụta nke na-adịghị mma',
    'trust_instincts': 'Tụkwasị obi na echiche gị',
  },
  ar: {
    'emergency': 'طوارئ',
    'report_incident': 'الإبلاغ عن حادث',
    'safe_walk': 'المشي الآمن',
    'panic_button': 'زر الذعر',
    'help': 'مساعدة',
    'location': 'الموقع',
    'description': 'الوصف',
    'submit': 'إرسال',
    'cancel': 'إلغاء',
    'speak_now': 'تحدث الآن...',
    'listening': 'أستمع...',
    'voice_input': 'إدخال صوتي',
    'text_input': 'إدخال نصي',
    'translate': 'ترجم',
    'emergency_contacts': 'جهات الاتصال الطارئة',
    'police': 'الشرطة',
    'ambulance': 'الإسعاف',
    'fire_service': 'خدمة الإطفاء',
    'safety_tips': 'نصائح الأمان',
    'stay_safe': 'ابق آمناً وكن على دراية بما يحيط بك',
    'call_for_help': 'اطلب المساعدة إذا شعرت بعدم الأمان',
    'trust_instincts': 'ثق في غرائزك',
  },
};

export default function LanguageSupport() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  // Speech Recognition
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = getLanguageCode(currentLanguage);

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(transcript);
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [currentLanguage, toast]);

  const getLanguageCode = (lang: string) => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'ha': 'ha-NG',
      'yo': 'yo-NG',
      'ig': 'ig-NG',
      'ar': 'ar-SA',
    };
    return langMap[lang] || 'en-US';
  };

  const startListening = () => {
    if (recognition) {
      recognition.lang = getLanguageCode(currentLanguage);
      setIsListening(true);
      setVoiceText('');
      recognition.start();
    } else {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const translateText = (text: string, targetLang: string) => {
    // Simple translation using our predefined translations
    // In a real app, you'd use Google Translate API or similar
    const words = text.toLowerCase().split(' ');
    const translatedWords = words.map(word => {
      // Remove punctuation for lookup
      const cleanWord = word.replace(/[.,!?;]/g, '');
      return translations[targetLang]?.[cleanWord] || word;
    });
    return translatedWords.join(' ');
  };

  const handleTranslate = () => {
    if (inputText.trim()) {
      const translated = translateText(inputText, currentLanguage);
      setTranslatedText(translated);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(currentLanguage);
      utterance.rate = 0.8;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const t = (key: string) => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Languages className="h-8 w-8 mr-3 text-blue-600" />
          Language & Voice Support
        </h1>
        <p className="text-muted-foreground">
          Access safety features in your preferred language with voice input support
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Language Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      <span className="text-muted-foreground">({lang.nativeName})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="grid grid-cols-2 gap-2">
              {supportedLanguages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={currentLanguage === lang.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentLanguage(lang.code)}
                  className="justify-start"
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.nativeName}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="h-5 w-5 mr-2" />
              Voice Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                className="flex-1"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    {t('listening')}
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    {t('voice_input')}
                  </>
                )}
              </Button>
            </div>
            
            {voiceText && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm font-medium text-green-800 mb-1">Voice Input:</div>
                <div className="text-green-700">{voiceText}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Languages className="h-5 w-5 mr-2" />
            Translation & Text-to-Speech
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('text_input')}</label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('speak_now')}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleTranslate} className="flex-1">
              <Languages className="h-4 w-4 mr-2" />
              {t('translate')}
            </Button>
            
            <Button
              onClick={() => translatedText ? speakText(translatedText) : speakText(inputText)}
              variant="outline"
              disabled={!inputText.trim()}
            >
              {isPlaying ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Speak
                </>
              )}
            </Button>
          </div>
          
          {translatedText && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-2">
                Translation ({supportedLanguages.find(l => l.code === currentLanguage)?.nativeName}):
              </div>
              <div className="text-blue-700 text-lg">{translatedText}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('emergency_contacts')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium">{t('police')}</span>
              <span className="font-bold text-red-600">199</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">{t('ambulance')}</span>
              <span className="font-bold text-blue-600">199</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">{t('fire_service')}</span>
              <span className="font-bold text-orange-600">199</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('safety_tips')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">{t('stay_safe')}</div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => speakText(t('stay_safe'))}
                className="p-1 h-auto"
              >
                <Headphones className="h-3 w-3" />
              </Button>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">{t('call_for_help')}</div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => speakText(t('call_for_help'))}
                className="p-1 h-auto"
              >
                <Headphones className="h-3 w-3" />
              </Button>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">{t('trust_instincts')}</div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => speakText(t('trust_instincts'))}
                className="p-1 h-auto"
              >
                <Headphones className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
