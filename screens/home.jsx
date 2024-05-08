import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

export default function Home({ navigation }) {
  const user = useSelector((store) => store.user.user);
  return (
    <View
      style={{ alignItems: "center", justifyContent: "center", height: "100%" }}
    >
      <View syle={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}>
        <Text> Welcome: {user.email}</Text>
      </View>
    </View>
  );
}
