import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { schoolData } from './SchoolGuideData';
import { Theme } from './Theme';
import { useTheme } from './ThemeProvider';
import { supabase } from '../supabase';

const SchoolGuides = () => {
    const { colorScheme } = useTheme();

    const [school, setSchool] = useState(schoolData);
    const [expandedGuide, setExpandedGuide] = useState(null);
    const [favorite, setFavorite] = useState([]);
    const navigation = useNavigation(); // Get navigation object using useNavigation hook

    const handlePress = (index) => {
        setExpandedGuide(index === expandedGuide ? null : index);
    };

    const user = supabase.auth.getUser();

    const handleFavorite = async (userId, guideId, guideName) => {
        try {
            const { data, error } = await supabase
                .from('favorite guides')
                .insert({
                    profile_id: userId,
                    guide_id: guideId,
                    guide_name: guideName,
                });
    
            if (error) {
                throw new Error('Error favoriting guide:', error.message);
            }
    
            console.log('Guide favorited successfully:', data);
            // Handle UI update or navigation as needed
        } catch (error) {
            console.error('Error favoriting guide:', error.message);
        }
    };
    

    const renderSections = (sections) => {
        return sections.map((section, index) => (
            <View key={index}>
                <Text style={[styles.sectionHeading, { color: colorScheme.secondary }]}>
                    {section.heading}
                </Text>
                <Text style={[styles.sectionContent, { color: colorScheme.text }]}>
                    {section.content}
                </Text>
            </View>
        ));
    };

    const renderItem = ({ item, index }) => {
        const isExpanded = index === expandedGuide;

        return (
            <TouchableOpacity onPress={() => handlePress(index)}>


                <View style={styles.itemContainer}>
                    <Text style={[styles.title, { color: colorScheme.secondaryRich }]}>
                        {item.title}
                    </Text>
                    {isExpanded && (
                        <View style={styles.expandedContent}>
                            {renderSections(item.sections)}
                            <TouchableOpacity onPress={() => handleFavorite(user.id, item.id, item.title)} style={styles.backButton}>
                                <Text style={styles.backButtonText}>Would you like to favorite this guide?</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

            </TouchableOpacity>
        );
    };



    return (
        <View style={[styles.container, { backgroundColor: colorScheme.background }]}>
            <Text style={[styles.heading, { color: colorScheme.text }]}>
                School Guides
            </Text>
            <FlatList
                data={school}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}

            />
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: colorScheme.tertiary }]}>
                <Text style={[styles.backButtonText, { color: colorScheme.text }]}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 35,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 40,
    },
    itemContainer: {
        marginBottom: 10,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    expandedContent: {
        marginLeft: 10,
    },
    sectionHeading: {
        fontWeight: 'bold',
        marginBottom: 3,
        fontSize: 20,
    },
    sectionContent: {
        marginBottom: 10,
    },
    backButton: {
        justifyConten: 'center',
        marginBottom: 80,
        padding: 10,
        padding: 10,
        borderRadius: 10, // Back button background color

    },
    backButtonText: {
        textAlign: 'center'
    },
});

export default SchoolGuides;
