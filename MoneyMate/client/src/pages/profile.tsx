import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  User,
  Settings,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Profile</h1>
      
      <Card>
        <CardContent className="p-0">
          <div className="p-4 flex items-center">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-semibold mr-4">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-base font-medium text-gray-800">User</h2>
              <p className="text-sm text-gray-500">user@example.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="py-2 border-b border-gray-100">
            <div className="px-4 py-2 flex justify-between items-center">
              <div className="flex items-center">
                <Moon className="h-5 w-5 text-gray-500 mr-3" />
                <Label htmlFor="dark-mode" className="text-sm font-medium">Dark Mode</Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </div>
          
          <div className="py-2 border-b border-gray-100">
            <div className="px-4 py-2 flex justify-between items-center">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-500 mr-3" />
                <Label htmlFor="notifications" className="text-sm font-medium">Notifications</Label>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
          
          <div className="py-2">
            <Button variant="ghost" className="w-full justify-between px-4 py-2 h-auto">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm font-medium">Account Settings</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Support</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="py-2 border-b border-gray-100">
            <Button variant="ghost" className="w-full justify-between px-4 py-2 h-auto">
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm font-medium">Help Center</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
          
          <div className="py-2">
            <Button variant="ghost" className="w-full justify-start px-4 py-2 h-auto text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">Log Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
