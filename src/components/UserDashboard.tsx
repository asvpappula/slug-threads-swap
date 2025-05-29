import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClothing, ClothingItem } from '@/contexts/ClothingContext';
import { Edit, Trash2, MessageCircle, Plus, LogOut, Package, CheckCircle, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import ProfileEditModal from './ProfileEditModal';

interface UserDashboardProps {
  onNavigateToSell: () => void;
  onStartChat: (item: ClothingItem) => void;
}

const UserDashboard = ({ onNavigateToSell, onStartChat }: UserDashboardProps) => {
  const { user, logout } = useAuth();
  const { items, getUserItems, deleteItem, markAsSold } = useClothing();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('listings');
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const userItems = getUserItems(user?.id || '');
  
  const handleMarkAsSold = async (itemId: string) => {
    if (!user) return;
    
    const success = await markAsSold(itemId, user.id);
    if (success) {
      toast({
        title: "Item marked as sold! 🎉",
        description: "This item will be automatically removed in 24 hours.",
      });
    } else {
      toast({
        title: "Error",
        description: "Could not mark item as sold. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!user || !itemToDelete) return;
    
    const success = await deleteItem(itemToDelete, user.id);
    if (success) {
      toast({
        title: "Item deleted",
        description: "Your item has been removed successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Could not delete item. Please try again.",
        variant: "destructive"
      });
    }
    setItemToDelete(null);
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        {/* Enhanced Welcome Header with Profile Info */}
        <div className="bg-gradient-to-r from-ucsc-gold to-ucsc-peach rounded-2xl p-6 mb-6 text-ucsc-navy">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={user.profilePic} 
                alt={user.username}
                className="w-16 h-16 rounded-full border-2 border-white shadow-md"
              />
              <div>
                <h2 className="text-2xl font-bold mb-1">Hi {user.username}! 👋</h2>
                <p className="opacity-80 text-sm">Here's your closet.</p>
                <div className="mt-2 space-y-1">
                  {user.college && (
                    <p className="text-sm font-medium">🎓 {user.college}</p>
                  )}
                  {user.studentId && (
                    <p className="text-sm">🪪 UCSC ID: #{user.studentId}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowProfileEdit(true)}
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-ucsc-navy hover:bg-white/30"
              >
                <Settings size={16} className="mr-2" />
                Edit Profile
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-ucsc-navy hover:bg-white/30"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Package size={16} />
              My Listings ({userItems.length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageCircle size={16} />
              Messages (0)
            </TabsTrigger>
            <TabsTrigger value="add-item" className="flex items-center gap-2">
              <Plus size={16} />
              Add New Item
            </TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="space-y-4">
            {userItems.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No items listed yet</h3>
                  <p className="text-gray-500 mb-4">Start selling by adding your first item!</p>
                  <Button onClick={onNavigateToSell} className="bg-ucsc-navy">
                    <Plus size={16} className="mr-2" />
                    Add Your First Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative">
                          <img 
                            src={item.images[0]} 
                            alt={item.title}
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                          {item.isSold && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-sm">SOLD</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{item.title}</h3>
                              <p className="text-ucsc-gold font-bold text-xl">${item.price}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {item.isSold ? (
                                  <div className="flex flex-col">
                                    <span className="flex items-center gap-1 text-green-600 text-sm">
                                      <CheckCircle size={14} />
                                      Sold
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      This item will be removed in 24 hours
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-green-600 text-sm font-medium">Available</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit size={14} className="mr-1" />
                                Edit
                              </Button>
                              {!item.isSold && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleMarkAsSold(item.id)}
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Mark Sold
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setItemToDelete(item.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No messages yet</h3>
                <p className="text-gray-500">Your conversations will appear here once you start chatting with buyers or sellers.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-item">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus size={20} />
                  Quick Add New Item
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-gray-600 mb-6">Ready to list a new item? Click below to go to the full sell page.</p>
                <Button onClick={onNavigateToSell} size="lg" className="bg-ucsc-navy">
                  <Plus size={20} className="mr-2" />
                  Go to Sell Page
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ProfileEditModal 
          isOpen={showProfileEdit} 
          onClose={() => setShowProfileEdit(false)} 
        />

        <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this item from your listings.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Item
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default UserDashboard;