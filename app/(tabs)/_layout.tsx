import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbolName } from '@/components/ui/IconSymbol';
type SFSymbols5_0 = IconSymbolName;

export default function TabLayout() {
    const colorScheme = useColorScheme();

    // Define a mapping for tab icons
    const iconMap: Record<string, string> = {
        index: 'list.fill',
        profile: 'person.fill',
        explore: 'map.fill',
    };

    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarInactiveTintColor: 'black',
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: () => (
                    <LinearGradient
                        colors={['#B0BEC5', '#64B5F6']}
                        style={{ flex: 1, borderRadius: 20 }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                ),
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                        backgroundColor: 'transparent',
                        borderRadius: 20,
                        marginBottom: 16,
                        marginHorizontal: 8,
                        elevation: 5,
                    },
                    default: {
                        backgroundColor: '#E0E0E0',
                        borderRadius: 20,
                    },
                }),
                tabBarIcon: ({ focused, color }) => {
                    const iconName = iconMap[route.name] ?? 'circle'; // Default to 'circle' if route.name is undefined
                    const iconColor = focused ? color : 'white'; // Set to white when not focused

                    const scale = new Animated.Value(focused ? 1.2 : 1);
                    Animated.spring(scale, { toValue: focused ? 1.3 : 1, useNativeDriver: true }).start();

                    return (
                        <Animated.View style={{ transform: [{ scale }] }}>
                            <IconSymbol size={30} name={iconName as SFSymbols5_0} color={iconColor} />
                        </Animated.View>
                    );
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Todos',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                }}
            />
        </Tabs>
    );
}
