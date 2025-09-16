import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast, 
  MousePointer,
  Keyboard,
  Accessibility,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  textSize: number;
  screenReader: boolean;
  voiceNavigation: boolean;
  reducedMotion: boolean;
  colorBlindMode: string;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  textSize: 16,
  screenReader: false,
  voiceNavigation: false,
  reducedMotion: false,
  colorBlindMode: 'none',
  keyboardNavigation: true,
  audioDescriptions: false,
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
};

export default function AccessibilitySettings() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    applySettings(settings);
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast mode
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large text
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Color blind mode
    root.className = root.className.replace(/colorblind-\w+/g, '');
    if (newSettings.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${newSettings.colorBlindMode}`);
    }
    
    // Font size
    root.style.setProperty('--base-font-size', `${newSettings.fontSize}px`);
    root.style.setProperty('--line-height', newSettings.lineHeight.toString());
    root.style.setProperty('--letter-spacing', `${newSettings.letterSpacing}px`);
    
    // Keyboard navigation
    if (newSettings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "Accessibility settings have been reset to defaults.",
    });
  };

  const testScreenReader = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Screen reader test. This is how text will be read aloud to assist users with visual impairments."
      );
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Screen Reader Not Available",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Accessibility className="h-8 w-8 mr-3 text-purple-600" />
          Accessibility Settings
        </h1>
        <p className="text-muted-foreground">
          Customize the app to meet your accessibility needs and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Visual Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">High Contrast Mode</label>
                <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Large Text</label>
                <p className="text-sm text-muted-foreground">Increase text size throughout the app</p>
              </div>
              <Switch
                checked={settings.largeText}
                onCheckedChange={(checked) => updateSetting('largeText', checked)}
              />
            </div>

            <div className="space-y-3">
              <label className="font-medium">Font Size</label>
              <div className="px-3">
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => updateSetting('fontSize', value)}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>12px</span>
                  <span>{settings.fontSize}px</span>
                  <span>24px</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-medium">Line Height</label>
              <div className="px-3">
                <Slider
                  value={[settings.lineHeight]}
                  onValueChange={([value]) => updateSetting('lineHeight', value)}
                  min={1.2}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1.2</span>
                  <span>{settings.lineHeight.toFixed(1)}</span>
                  <span>2.0</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-medium">Color Blind Support</label>
              <Select
                value={settings.colorBlindMode}
                onValueChange={(value) => updateSetting('colorBlindMode', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                  <SelectItem value="monochromacy">Monochromacy (Complete color blindness)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="h-5 w-5 mr-2" />
              Audio Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Screen Reader Support</label>
                <p className="text-sm text-muted-foreground">Enable text-to-speech functionality</p>
              </div>
              <Switch
                checked={settings.screenReader}
                onCheckedChange={(checked) => updateSetting('screenReader', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Voice Navigation</label>
                <p className="text-sm text-muted-foreground">Navigate using voice commands</p>
              </div>
              <Switch
                checked={settings.voiceNavigation}
                onCheckedChange={(checked) => updateSetting('voiceNavigation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Audio Descriptions</label>
                <p className="text-sm text-muted-foreground">Describe visual elements audibly</p>
              </div>
              <Switch
                checked={settings.audioDescriptions}
                onCheckedChange={(checked) => updateSetting('audioDescriptions', checked)}
              />
            </div>

            <Button onClick={testScreenReader} variant="outline" className="w-full">
              <Volume2 className="h-4 w-4 mr-2" />
              Test Screen Reader
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Keyboard className="h-5 w-5 mr-2" />
              Navigation Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Keyboard Navigation</label>
                <p className="text-sm text-muted-foreground">Navigate using keyboard only</p>
              </div>
              <Switch
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Reduced Motion</label>
                <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Keyboard Shortcuts</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div><kbd className="bg-blue-200 px-1 rounded">Tab</kbd> - Navigate forward</div>
                <div><kbd className="bg-blue-200 px-1 rounded">Shift + Tab</kbd> - Navigate backward</div>
                <div><kbd className="bg-blue-200 px-1 rounded">Enter</kbd> - Activate button/link</div>
                <div><kbd className="bg-blue-200 px-1 rounded">Space</kbd> - Toggle switch/checkbox</div>
                <div><kbd className="bg-blue-200 px-1 rounded">Esc</kbd> - Close modal/menu</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Preview & Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Preview Mode</label>
                <p className="text-sm text-muted-foreground">See how settings affect the interface</p>
              </div>
              <Switch
                checked={isPreviewMode}
                onCheckedChange={setIsPreviewMode}
              />
            </div>

            {isPreviewMode && (
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <h4 className="font-medium mb-2">Preview Sample</h4>
                <p className="text-sm mb-2">
                  This is how text will appear with your current settings. 
                  The quick brown fox jumps over the lazy dog.
                </p>
                <Button size="sm" variant="outline">Sample Button</Button>
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={resetSettings} variant="outline" className="flex-1">
                Reset to Defaults
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Your accessibility preferences have been saved.",
                  });
                }}
                className="flex-1"
              >
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accessibility Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Eye className="h-4 w-4 mr-2 text-blue-500" />
                For Visual Impairments
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Enable high contrast mode for better visibility</li>
                <li>• Increase font size if text is hard to read</li>
                <li>• Use screen reader for audio feedback</li>
                <li>• Enable keyboard navigation for easier control</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Volume2 className="h-4 w-4 mr-2 text-green-500" />
                For Hearing Impairments
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Visual alerts will replace audio notifications</li>
                <li>• Text descriptions for audio content</li>
                <li>• Vibration alerts on mobile devices</li>
                <li>• Clear visual feedback for all actions</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <MousePointer className="h-4 w-4 mr-2 text-purple-500" />
                For Motor Impairments
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Large touch targets for easier interaction</li>
                <li>• Keyboard navigation support</li>
                <li>• Voice commands for hands-free operation</li>
                <li>• Reduced motion to prevent discomfort</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Contrast className="h-4 w-4 mr-2 text-orange-500" />
                For Cognitive Impairments
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Simple, clear interface design</li>
                <li>• Consistent navigation patterns</li>
                <li>• Audio descriptions for complex content</li>
                <li>• Reduced motion to minimize distractions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
