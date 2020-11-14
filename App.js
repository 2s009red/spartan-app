import * as React from 'react';
import { View, Pressable } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { FloatingAction } from "react-native-floating-action";
import { Badge, Card, Image, Text, ListItem, Icon, Slider, Divider, Button, Input } from 'react-native-elements'
import { MultiSlider } from '@ptomasroos/react-native-multi-slider'
import { render } from 'react-dom';

const fabText = require("./assets/fab-text.png")

const actions = [
  {
    text: "Start sparring",
    icon: <Icon
      name='ios-hand'
      type='ionicon'
      color='#fff' />,
    name: "fab_sparring",
    position: 1
  },
  {
    text: "Start drilling",
    icon: <Icon
      name='ios-list'
      type='ionicon'
      color='#fff' />,
    // icon: require("./assets/favicon.png"),
    // icon: require("./images/ic_language_white.png"),
    name: "fab_drilling",
    position: 2
  },
];

// TODO change combos
// Map ID to combo
const combos = new Map();
combos.set(0, { name: "Joush's combo", id: 0, moves: [{name: "quick jab", speed: 1, extension: 0.7, duration: 1}, {name: "full punch", speed: 0.7, extension: 1, duration: 1}, {name: "feint", speed: 1, extension: 0.3, duration: 1}] });
combos.set(1, { name: "Red critter's combo", id: 1, moves: [{name: "quick jab", speed: 1, extension: 1, duration: 1}, {name: "full punch", speed: 0.5, extension: 0.4, duration: 1}] });

let comboCardObj = { name: "Josh's Favorite Combo", author: "Joushua Padilla" }

function DrillingScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>work in progress</Text>
      <FloatingAction
        actions={actions}
        floatingIcon={
          <Icon
            name='ios-play'
            type='ionicon'
            color='#fff' />
        }
        onPressItem={name => {
          console.log(`selected button: ${name}`);
        }}
      />

    </View>
  );
}

function ComboListScreen({ navigation }) {
  return (
    <View>
      {/* {combos.entries().map((item, i) => ( */}
      {Array.from(combos, ([k, v]) =>
        <ListItem bottomDivider style={{margin: 10}} key={k} onPress={() => navigation.navigate('ComboEditor', { id: k, combo: v })} >
          <ListItem.Content>
            <ListItem.Title style={{ fontWeight: "bold" }}>{v.name}</ListItem.Title>
            <ListItem.Subtitle>{v.moves.length} moves</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

      )}
    </View>
  );
}

function ComboEditorScreen({ route, navigation }) {
  return (
    <View style={{alignItems: "center"}}>
      {route.params.combo.moves.map((move, i) => 
        <ListItem bottomDivider style={{width: "80%"}} key={i}  onPress={() => navigation.navigate('MoveEditor', { id: i, move: move })}>
          <Badge
            value={i + 1}
            status="success"
          />

          <ListItem.Content>
            <ListItem.Title style={{ fontWeight: "bold" }}>{move.name}</ListItem.Title>
            <ListItem.Subtitle>{getMoveDescription(move)}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      )}
      <Button style={{margin: 50}}
        title="Start combo">
      </Button>
    </View>
  );
}

function MoveEditorScreen({ route, navigation }) {
  return (
    <View>
      <View style={{ margin: 10, width: "100%", alignItems: 'center' }}>
        <Text style={{ fontSize: 20, margin: 20 }}>Speed</Text>
        <Slider
          style={{ width: "80%" }}
          value={0.5}
          allowTouchTrack={true}
        />
      </View>
      <View style={{ margin: 10, width: "100%", alignItems: 'center' }}>
        <Text style={{ fontSize: 20, margin: 20 }}>Extension</Text>
        <Slider
          style={{ width: "80%" }}
          value={0.5}
          allowTouchTrack={true}
        />
      </View>
      <View style={{ margin: 10, width: "100%", alignItems: 'center' }}>
        <Text style={{ fontSize: 20, margin: 20 }}>Pause</Text>
        <Slider
          style={{ width: "80%" }}
          value={0.5}
          allowTouchTrack={true}
        />
      </View>
    </View>
  );
}

const getMoveDescription = (move) => {
  let moveSpeedDescription;
  let moveExtensionDescription;
  let movePauseDescription;

  switch (true) {
    case (move.speed < 0.4):
      moveSpeedDescription = "slow";
      break;

    case (move.speed < 0.8):
      moveSpeedDescription = "medium";
      break;

    default:
      moveSpeedDescription = "fast";
      break;
  }

  switch (true) {
    case (move.extension < 0.4):
      moveExtensionDescription = "short";
      break;

    case (move.extension < 0.8):
      moveExtensionDescription = "medium";
      break;

    default:
      moveExtensionDescription = "far";
      break;
  }

  return `${moveSpeedDescription} speed, ${moveExtensionDescription} extension`
}

const homeScreenCards = [

];

function HomeScreenCard() {
  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <Text style={{ marginLeft: 20, fontSize: 40, fontWeight: "bold" }}>Feed</Text>
      <Card>
        <Card.Title style={{textAlign: "left"}}>Red critter shares his ultimate boxing combo</Card.Title>
        <Card.Image source={{ uri: "https://www.muscleandfitness.com/wp-content/uploads/2020/05/boxer-training-bag.jpg" }} />
        <Text style={{ marginTop: 10, }}>
          Watch as the red critter shares ten years of pro boxing experience, all before he became a mascot for 2.s009 2020
        </Text>
      </Card>
      <Card>
        <Card.Title style={{textAlign: "left"}}>Joush talks boxing</Card.Title>
        <Card.Image source={{ uri: "http://getwallpapers.com/wallpaper/full/5/f/3/103359.jpg" }} />
        <Text style={{ marginTop: 10 }}>
          blah blah blah Joush probably couldn't take on the red critter in a fight anyway so why do you care (haha jk ...unless?)
        </Text>
      </Card>

    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Work in progress</Text>
    </View>
  );
}

const formatDuration = duration => {
  if (typeof duration !== "string") {
    duration = duration.toString();
  }

  return `${duration.slice(0, duration.length - 2).padStart(1, '0')}:${duration.slice(duration.length - 2).padStart(2, '0')}`
}

class TimerInput extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      time: props.time
    };
  }

  render() {
    return (
      <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
        <Text style={{ flex: 1, fontSize: 20, textAlign: "center" }}>{this.props.name}</Text>
        <Input containerStyle={{ flex: 1, }} inputContainerStyle={{ borderBottomWidth: 0 }}
          style={{ alignItems: "center", fontSize: 30, textAlign: "center" }}
          keyboardType="numeric"
          value={this.state.time}
          selectTextOnFocus={true}
          contextMenuHidden={true}
          returnKeyType="done"

          caretHidden={true}
          onChangeText={text => this.setState({ time: formatDuration(parseInt(text.replace(':', ''))) })}
        />
      </View>
    );
  }
}

class SparringScreen extends React.Component {
  // TODO should we save default values from last time, to use this time?
  state = {
    // TODO what order should these be in? also what order on the screen
    extension: 1,
    speed: 1,
    frequency: 1,

    roundTime: "300",
    restTime: 30,
    numRounds: 3,
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-around" }}>
        <View style={{ margin: 10, width: "100%", alignItems: 'center' }}>
          <Text style={{ fontSize: 20, margin: 20 }}>Extension</Text>
          <Slider
            style={{ width: "80%" }}
            value={0.5}
            allowTouchTrack={true}
          />
        </View>
        <View style={{ margin: 10, width: "100%", alignItems: 'center' }}>
          <Text style={{ fontSize: 20, margin: 20 }}>Frequency</Text>
          <Slider
            style={{ width: "80%" }}
            value={0.5}
            allowTouchTrack={true}
          />
        </View>
        <View style={{ margin: 10, width: "100%", alignItems: 'center' }}>
          <Text style={{ fontSize: 20, margin: 20 }}>Speed</Text>
          <Slider
            style={{ width: "80%" }}
            value={0.5}
            allowTouchTrack={true}
          />
        </View>
        <View style={{ margin: 30, flexDirection: "row", height: 50}}>
          <TimerInput name="round time" time="3:00" />
          <TimerInput name="rest time" time="0:30" />

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, textAlign: "center" }}>num rounds</Text>
            <Input containerStyle={{ flex: 1 }} inputContainerStyle={{ borderBottomWidth: 0 }}
              style={{textAlign: "center", fontSize: 30}}
              keyboardType="numeric"

              returnKeyType="done"
              defaultValue={"3"}
            />
          </View>
        </View>
        <View style={{flexDirection: "row"}}>
          <Button
            style={{ margin: 90 }}
            title="Start"
          />
          <Button
            style={{ margin: 90 }}
            title="Stop"
          />
        </View>
      </View>
    );
  }
}

function ComboCard() {
  return (

    <ListItem
      onPress={() => console.log('press')}
    >
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: 'bold' }}>
          Chris Jackson
        </ListItem.Title>
        <ListItem.Subtitle style={{}}>
          Vice Chairman
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron color="white" />
    </ListItem>

  );
}

function HomeScreen() {
  return (
    <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
      <HomeScreenCard />
    </View>
  );
}


const Tab = createBottomTabNavigator();
const ComboStack = createStackNavigator();

const CombosScreen = () => (
  <ComboStack.Navigator>
    <ComboStack.Screen name="ComboList"  component={ComboListScreen} />
    <ComboStack.Screen name="ComboEditor" component={ComboEditorScreen} />
    <ComboStack.Screen name="MoveEditor" component={MoveEditorScreen} />
  </ComboStack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Combos">
        <Tab.Screen name="Home" component={HomeScreen} 
          options={{
            tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
          }}
        />
        {/* TODO: change friends to social and actually make it work*/}
        <Tab.Screen name="Friends" component={SettingsScreen} 
          options={{
            tabBarIcon: ({ color }) => <Icon name="people" color={color} />,
          }}
        />
        <Tab.Screen name="Combos" component={CombosScreen} 
          options={{
            tabBarIcon: ({ color }) => <Icon name="list" color={color} />,
          }}
        />
        <Tab.Screen name="Sparring" component={SparringScreen}
          options={{
            tabBarIcon: ({ color }) => <Icon name="fist-raised" color={color} type="font-awesome-5" />,
          }}
        />
        <Tab.Screen name="Drilling" component={DrillingScreen}
          options={{
            tabBarIcon: ({ color }) => <Icon name="fist-raised" color={color} type="font-awesome-5" />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

