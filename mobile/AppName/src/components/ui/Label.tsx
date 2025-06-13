import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface LabelProps extends TextProps {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333333',
  },
});

export default Label;
