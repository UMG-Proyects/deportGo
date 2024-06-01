import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CustomHeader = ({ navigation, title }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <MaterialIcons name="menu" size={28} color="black" />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{title}</Text>
      </View>
      <Image
        source={require("../src/Image/logo.jpeg")}
        style={{ width: 45, height: 45 }}
      />
    </View>
  );
};

export default CustomHeader;
