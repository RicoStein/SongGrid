import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';

type Option = {
  id: string;
  label: string;
  colorImage: any;
  bwImage: any;
};

type Props = {
  options: Option[];
  selected: string[];
  onToggle: (id: string) => void;
};

const SPACING = 12;
const NUM_COLUMNS = 3;

const FilterGrid = ({ options, selected, onToggle }: Props) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const itemSize = containerWidth
    ? (containerWidth - SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS
    : 0;

  return (
    <View style={styles.grid} onLayout={handleLayout}>
      {containerWidth > 0 &&
        options.map((item, index) => {
          const isSelected = selected.includes(item.id);
          const isLastInRow = (index + 1) % NUM_COLUMNS === 0;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                {
                  width: itemSize,
                  height: itemSize,
                  marginRight: isLastInRow ? 0 : SPACING,
                  marginBottom: SPACING,
                },
                isSelected && styles.itemSelected,
              ]}
              onPress={() => onToggle(item.id)}
            >
              <Image
                source={isSelected ? item.colorImage : item.bwImage}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.labelContainer}>
                <Text style={styles.label}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  item: {
  borderRadius: 8,
  overflow: 'hidden',
  borderWidth: 2,
  borderColor: '#ccc', // graue Umrandung als Standard
},
  itemSelected: {
    borderColor: '#0B3D91',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FilterGrid;
