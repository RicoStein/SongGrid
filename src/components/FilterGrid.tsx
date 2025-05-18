import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

export default function FilterGrid({ options, selected, onToggle }) {
    return (
        <View style={styles.grid}>
            {options.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => onToggle(item.id)}
                        style={[
                            styles.card,
                            isSelected && styles.selectedCard,
                        ]}
                    >
                        <Image
                            source={isSelected ? item.colorImage : item.bwImage}
                            style={styles.image}
                        />
                        <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: '#fff', // <- wichtig
        padding: 10,
        borderRadius: 12,
        marginTop: 8,
    },
    card: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#fff',
    },
    selectedCard: {
        borderColor: '#0B3D91',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    grayImage: {
        tintColor: '#000',
        opacity: 0.5,
    },
    label: {
        color: '#fff',
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        position: 'absolute',
        bottom: 6,
    },
});
