import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaProps {
  children: React.ReactNode;
}

const SafeArea: React.FC<SafeAreaProps> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: 0.1 }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeArea;
