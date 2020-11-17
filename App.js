import * as React from 'react';
import { ScrollView, View, Pressable, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { FloatingAction } from "react-native-floating-action";
import { Badge, Card, Text, ListItem, Icon, Slider, Divider, Button, Input, colors, Avatar } from 'react-native-elements'
import { MultiSlider } from '@ptomasroos/react-native-multi-slider'
import { render } from 'react-dom';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { useTheme } from '@react-navigation/native'

import Colors from './constants/Colors';

const SERVER_IP = "http://35.173.125.185"

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
    name: "fab_drilling",
    position: 2
  },
];

// TODO settle on either "training" or "workout" throughout

// TODO change combos
// Map ID to combo
const combos = new Map();
combos.set(0, { title: "Joush's combo", description: loremIpsum, id: 0, moves: [{name: "quick jab", speed: 1, extension: 0.7, duration: 1}, {name: "full punch", speed: 0.7, extension: 1, duration: 1}, {name: "feint", speed: 1, extension: 0.3, duration: 1}, {name: "quick jab", speed: 1, extension: 0.7, duration: 1}, {name: "full punch", speed: 0.7, extension: 1, duration: 1}, {name: "feint", speed: 1, extension: 0.3, duration: 1}], duration: 45 });
combos.set(1, { title: "Red critter's combo", description: loremIpsum, id: 1, moves: [{name: "quick jab", speed: 1, extension: 1, duration: 1}, {name: "full punch", speed: 0.5, extension: 0.4, duration: 1}], duration: 185 });

let comboCardObj = { name: "Josh's Favorite Combo", author: "Joush Padilla" }

function secondsToTimestring(seconds) {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
}

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris";
const drewPicture = "https://firebasestorage.googleapis.com/v0/b/mit2s009.appspot.com/o/profiles%2Fthumb_andrewbc.jpg?alt=media&token=c7315a11-e854-4686-bf6f-26926f3270f1";
const joushPicture = "https://firebasestorage.googleapis.com/v0/b/mit2s009.appspot.com/o/profiles%2Fthumb_jgp7.jpg?alt=media&token=98bc24c8-fdb7-4221-876a-323a1ef748a7"

function AvatarWithSubtitle(props) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-start", width: "100%" }}>
      <Avatar rounded source={{ uri: props.uri }} />
      <View style={{ flexDirection: "column", marginLeft: 10 }}>
        <Text style={{ color: colors.text, fontWeight: "800" }}>{props.name}</Text>
        <Text style={{ color: colors.text }}>{props.subtitle}</Text>
      </View>
    </View>
  );
}

function WorkoutCard(props) {
  const { colors } = useTheme();
  // do we want to add a profile picture somewhere?
  // TODO should calculate combo length (duration) on the fly?
  // TODO this is limited to 3 for display purposes; we should animate this properly when user expands it
  // TODO why numToShow
  return (
    <View style={{ margin: 20, padding: 20, borderRadius: 15, backgroundColor: 'rgb(40, 40, 40)'}}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>{props.combo.title}</Text>
      <Text style={{ color: colors.text }}>{props.combo.moves.length} moves, {secondsToTimestring(props.combo.duration)} minutes</Text>
      <Text style={{ color: colors.text, fontSize: 15, marginBottom: 10, marginTop: 4 }}>{props.combo.description}</Text>

      <View style={{ backgroundColor: 'rgb(60, 60, 60)', borderRadius: 15 }}>
      {props.combo.moves.slice(0, props.numToShow).map((move, i) => 
        <ComboListItem move={move} index={i + 1} key={i} />
      )}
      </View>
    </View>
  );
}

function ComboListItem(props) {
  const { colors } = useTheme();
  // TODO change color of badges and do not rely on 'error'
  return (
    <ListItem containerStyle={{ borderRadius: 10, backgroundColor: 'rgb(60, 60, 60)' }}>
      <Badge
        value={props.index}
        textStyle={{ fontSize: 25}}
        badgeStyle={{ height: 30, width: 30, borderRadius: 15, borderWidth: 0 }}
        status="error"
      />

      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "bold", color: colors.text }}>{props.move.name}</ListItem.Title>
        <ListItem.Subtitle style={{ color: colors.text }}>{getMoveDescription(props.move)}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
}

function PunchToStartScreen({ route, navigation }) {
  const { colors } = useTheme();

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 50 }}>Punch to start</Text>
    </View>
  );
}

function WorkoutDetailScreen({ route, navigation }) {
  const { colors } = useTheme();

  // TODO undefined seems like a weird hack

  return (
    <ScrollView>
      <WorkoutCard combo={route.params.combo} key={route.params.id} numToShow={undefined} />
      <Button buttonStyle={{ backgroundColor: colors.primary, borderRadius: 15 }} title="Start training" onPress={() => navigation.navigate("PunchToStart")} />
    </ScrollView>
  );
}

function WorkoutListScreen({ navigation }) {
  const { colors } = useTheme();
  // TODO fix key prop

  return (
    <ScrollView >
      {/* <Text style={{ color: colors.text }}>
        Workouts
      </Text> */}
    <Button buttonStyle={{ backgroundColor: colors.primary, borderRadius: 15, margin: "5%" }} onPress={() => navigation.navigate("Sparring")} title="Start sparring" />
      <Text style={{ color: colors.text, textAlign: "center" }}>or choose from a workout below</Text>
      {Array.from(combos, ([k, v]) =>
        <TouchableWithoutFeedback key={k} onPress={() => navigation.navigate('WorkoutDetail', { id: k, combo: v })}>
        <WorkoutCard combo={v} key={k} numToShow={3} />
        </TouchableWithoutFeedback>
      )}
    </ScrollView>
  );
}

// function DrillingScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>work in progress</Text>
//       <FloatingAction
//         actions={actions}
//         floatingIcon={
//           <Icon
//             name='ios-play'
//             type='ionicon'
//             color='#fff' />
//         }
//         onPressItem={name => {
//           console.log(`selected button: ${name}`);
//         }}
//       />

//     </View>
//   );
// }

// function ComboListScreen({ navigation }) {
//   return (
//     <View>
//       {/* {combos.entries().map((item, i) => ( */}
//     </View>
//   );
// }
/*
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
*/
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

// function HomeScreenCard() {
//   const { colors } = useTheme();

//   return (
//     <ScrollView style={{ flex: 1, marginTop: 50 }}>
//       <Text style={{ marginLeft: 20, fontSize: 40, fontWeight: "bold", color: colors.text }}>Feed</Text>
//       <Card>
//         <Card.Title style={{textAlign: "left"}}>Red critter shares his ultimate boxing combo</Card.Title>
//         <Card.Image source={{ uri: "https://www.muscleandfitness.com/wp-content/uploads/2020/05/boxer-training-bag.jpg" }} />
//         <Text style={{ marginTop: 10, }}>
//           Watch as the red critter shares ten years of pro boxing experience, all before he became a mascot for 2.s009 2020
//         </Text>
//       </Card>
//       <Card>
//         <Card.Title style={{textAlign: "left"}}>Joush talks boxing</Card.Title>
//         <Card.Image source={{ uri: "http://getwallpapers.com/wallpaper/full/5/f/3/103359.jpg" }} />
//         <Text style={{ marginTop: 10 }}>
//           blah blah blah Joush probably couldn't take on the red critter in a fight anyway so why do you care (haha jk ...unless?)
//         </Text>
//       </Card>

//     </ScrollView>
//   );
// }

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
    // TODO wtf is this
    const textColor = 'rgb(225, 225, 225)'
    return (
      <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
        <Text style={{ flex: 1, fontSize: 20, textAlign: "center", color: textColor }}>{this.props.name}</Text>
        <Input containerStyle={{ flex: 1, }} inputContainerStyle={{ borderBottomWidth: 0 }}
          style={{ alignItems: "center", fontSize: 30, textAlign: "center", color: textColor }}
          keyboardType="numeric"
          value={this.state.time}
          selectTextOnFocus
          contextMenuHidden
          returnKeyType="done"

          caretHidden
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
    // TODO apparently we can't do this
    // const { colors } = useTheme();
    const textColor = 'rgb(225, 225, 225)'

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-around" }}>
        <View style={{ margin: 10, width: "100%", alignItems: 'center' }}>
          <Text style={{ fontSize: 20, margin: 20, color: 'rgb(225, 225, 225)'}}>Extension</Text>
          <Slider
            style={{ width: "80%" }}
            value={0.5}
            allowTouchTrack
            onSlidingComplete={(value) => {
              const data = { extension: value };

              fetch(`${SERVER_IP}/sparring-config`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
            }}
          />
        </View>
        <View style={{ margin: 10, width: "100%", alignItems: 'center' }}>
          <Text style={{ fontSize: 20, margin: 20, color: 'rgb(225, 225, 225)'}}>Frequency</Text>
          <Slider
            style={{ width: "80%" }}
            value={0.5}
            allowTouchTrack
            onSlidingComplete={(value) => {
              const data = { frequency: value };

              fetch(`${SERVER_IP}/sparring-config`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
            }}
          />
        </View>
        <View style={{ margin: 10, width: "100%", alignItems: 'center' }}>
          <Text style={{ fontSize: 20, margin: 20, color: 'rgb(225, 225, 225)'}}>Speed</Text>
          <Slider
            style={{ width: "80%" }}
            value={0.5}
            allowTouchTrack
            onSlidingComplete={(value) => {
              const data = { speed: value };

              fetch(`${SERVER_IP}/sparring-config`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
            }}
          />
        </View>
        <View style={{ margin: 30, flexDirection: "row", height: 50}}>
          <TimerInput name="round time" time="3:00" />
          <TimerInput name="rest time" time="0:30" />

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, textAlign: "center", color: textColor }}>num rounds</Text>
            <Input containerStyle={{ flex: 1 }} inputContainerStyle={{ borderBottomWidth: 0 }}
              style={{ textAlign: "center", fontSize: 30, color: textColor }}
              keyboardType="numeric"

              returnKeyType="done"
              defaultValue={"3"}
            />
          </View>
        </View>
        <View style={{flexDirection: "row"}}>
          <Button
            style={{ margin: 90 }}
            buttonStyle={{ backgroundColor: "red" }}
            title="Start"
            onPress={() => {
              const data = { spar: true };

              fetch(`${SERVER_IP}/spar`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
            }}
          />
          <Button
            style={{ margin: 90 }}
            buttonStyle={{ backgroundColor: "red" }}
            title="Stop"
            onPress={() => {
              const data = { spar: false };

              fetch(`${SERVER_IP}/spar`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
            }}
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

function FeedCard(props) {
  const { colors } = useTheme();
  // do we want to add a profile picture somewhere?
  // TODO should calculate combo length (duration) on the fly?
  // TODO this is limited to 3 for display purposes; we should animate this properly when user expands it
  // TODO why numToShow
  return (
    <View style={{ margin: 20, padding: 20, borderRadius: 15, backgroundColor: 'rgb(40, 40, 40)'}}>
      <AvatarWithSubtitle subtitle={props.subtitle} name={props.name} uri={props.picture} />
      <View style={{ backgroundColor: 'rgb(60, 60, 60)', marginTop: 10, borderRadius: 15, flexDirection: "row", alignItems: "center", width: "100%" }}>
        <Image source={ require('./assets/achievement-trophy.png') } 
          style={{ width: 50, height: 50 }}
        />
        <Text style={{ color: colors.text, fontSize: 15, padding: 10 }}>{props.description}</Text>

      </View>
    </View>
  );
}

function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "flex-start", }}>
      <FeedCard subtitle="earned an achievement" description={loremIpsum} name="Joush Padilla" picture={joushPicture} />
      <FeedCard subtitle="earned an achievement" description={loremIpsum} name="Drew Callahan" picture={drewPicture} />
      <FeedCard subtitle="did a thing" description={loremIpsum} name="Joush Padilla" picture={joushPicture} />
      <FeedCard subtitle="something else" description={loremIpsum} name="Joush Padilla" picture={joushPicture} />
      <FeedCard subtitle="earned an achievement" description={loremIpsum} name="Joush Padilla" picture={joushPicture} />
    </ScrollView>
  );
}

function ActivityScreen() {
  const { colors } = useTheme();

  return (

    <View>
      <Text style={{ fontSize: 50, color: colors.text }}>Recent trainings</Text>
    </View>

  );
}


const Tab = createBottomTabNavigator();
const ComboStack = createStackNavigator();

// TODO wtf this is terrible
const FeedScreen = () => (
  <ComboStack.Navigator>
    <ComboStack.Screen name="HomeScreen" component={HomeScreen} />
  </ComboStack.Navigator>
);

const WorkoutScreen = () => (
  <ComboStack.Navigator>
    <ComboStack.Screen name="WorkoutList" component={WorkoutListScreen} />
    <ComboStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
    <ComboStack.Screen name="Sparring" component={SparringScreen} />
    <ComboStack.Screen name="PunchToStart" component={PunchToStartScreen} />
  </ComboStack.Navigator>
);

const CombosScreen = () => (
  <ComboStack.Navigator>
    <ComboStack.Screen name="ComboList"  component={ComboListScreen} />
    <ComboStack.Screen name="ComboEditor" component={ComboEditorScreen} />
    <ComboStack.Screen name="MoveEditor" component={MoveEditorScreen} />
  </ComboStack.Navigator>
);

export default function App() {
  // TODO this fist is really ugly

  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator initialRouteName="Combos">
        <Tab.Screen name="Feed" component={FeedScreen} 
          options={{
            tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
          }}
        />
        <Tab.Screen name="Workouts" component={WorkoutScreen} 
          options={{
            tabBarIcon: ({ color }) => <Icon name="fist-raised" color={color} type="font-awesome-5" />,
          }}
        />
        <Tab.Screen name="Activity" component={ActivityScreen} 
          options={{
            tabBarIcon: ({ color }) => <Icon name="trending-up" color={color} />,
          }}
        />
        {/* <Tab.Screen name="Home" component={HomeScreen} 
          options={{
            tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
          }}
        />
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
        /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   parent: {
//     backgroundColor: Colors.BACKGROUND_COLOR,
//   }
// });

const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(233, 37, 43)',
    background: 'rgb(0, 0, 0)',
    card: 'rgb(0, 0, 0)',
    text: 'rgb(225, 225, 225)',
    border: 'rgb(50, 50, 50)',
    // notification: 'rgb(255, 69, 58)',
    // TODO idk what notification does
  },
};
