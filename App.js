import * as React from 'react';
import { ScrollView, View, StyleSheet, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Badge, Card, Text, ListItem, Icon, Button, Input, Avatar } from 'react-native-elements'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from '@react-navigation/native'

import Colors from './constants/Colors';

const SERVER_IP = "http://35.173.125.185"

// TODO settle on either "training" or "workout" throughout

// TODO we really shouldn't make this a global, but...
const textColor = 'rgb(225, 225, 225)'

// TODO change combos
// Map ID to combo
const combos = new Map();
combos.set(0, { title: "Flora's warmup", description: loremIpsum, id: 0, moves: [{name: "quick jab", speed: 1, extension: 0.7, duration: 1}, {name: "full punch", speed: 0.7, extension: 1, duration: 1}, {name: "feint", speed: 1, extension: 0.3, duration: 1}, {name: "quick jab", speed: 1, extension: 0.7, duration: 1}, {name: "full punch", speed: 0.7, extension: 1, duration: 1}, {name: "feint", speed: 1, extension: 0.3, duration: 1}], duration: 45 });
combos.set(1, { title: "Joush's warmup", description: loremIpsum, id: 0, moves: [{name: "quick jab", speed: 1, extension: 0.7, duration: 1}, {name: "full punch", speed: 0.7, extension: 1, duration: 1}, {name: "feint", speed: 1, extension: 0.3, duration: 1}, {name: "quick jab", speed: 1, extension: 0.7, duration: 1}, {name: "full punch", speed: 0.7, extension: 1, duration: 1}, {name: "feint", speed: 1, extension: 0.3, duration: 1}], duration: 45 });
combos.set(2, { title: "Drew's warmup", description: loremIpsum, id: 1, moves: [{name: "quick jab", speed: 1, extension: 1, duration: 1}, {name: "full punch", speed: 0.5, extension: 0.4, duration: 1}], duration: 185 });

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
    <View style={{ marginBottom: 20, padding: 20, borderRadius: 15, backgroundColor: 'rgb(40, 40, 40)'}}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>{props.combo.title}</Text>
      <Text style={{ color: colors.text, marginBottom: 20 }}>{props.combo.moves.length} moves, {secondsToTimestring(props.combo.duration)} minutes</Text>

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
    <ListItem containerStyle={{ borderRadius: 15, backgroundColor: 'rgb(60, 60, 60)' }}>
      <Badge
        value={props.index}
        textStyle={{ fontSize: 20}}
        badgeStyle={{ height: 30, width: 30, borderRadius: 15, borderWidth: 0, backgroundColor: colors.primary }}
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
    <View style={ styles.container }>
      <Text style={{ fontSize: 50, color: colors.text }}>Punch to start</Text>
      <Text style={{ fontSize: 30, color: colors.text }}>[insert animation here]</Text>
      <Button buttonStyle={ styles.button } title="Stop training" 
        onPress={() => {
          const data = { spar: false };

          fetch(`${SERVER_IP}/spar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          navigation.navigate("WorkoutList")
        }} />
    </View>
  );
}

function WorkoutDetailScreen({ route, navigation }) {
  const { colors } = useTheme();

  return (
    <ScrollView contentContainerStyle={ styles.container }>
      <WorkoutCard combo={route.params.combo} key={route.params.id} numToShow={undefined} />
      <Button buttonStyle={ styles.button } title="Start training" onPress={
          () => {
            const data = { spar: true };

            fetch(`${SERVER_IP}/spar`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            navigation.navigate("PunchToStart")
          }
        } />
    </ScrollView>
  );
}

function WorkoutListScreen({ navigation }) {
  const { colors } = useTheme();
  // TODO fix key prop

  return (
    <ScrollView contentContainerStyle={ styles.container }>
      <Button buttonStyle={ styles.button } onPress={() => navigation.navigate("Sparring")} title="Start sparring" />
        <Text style={{ color: colors.text, textAlign: "center" }}>or choose from a workout below</Text>
        {Array.from(combos, ([k, v]) =>
          <TouchableWithoutFeedback key={k} onPress={() => navigation.navigate('WorkoutDetail', { id: k, combo: v })}>
          <WorkoutCard combo={v} key={k} numToShow={3} />
          </TouchableWithoutFeedback>
        )}
    </ScrollView>
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

const formatDuration = duration => {
  if (typeof duration !== "string") {
    duration = duration.toString();
  }

  return `${duration.slice(0, duration.length - 2).padStart(1, '0')}:${duration.slice(duration.length - 2).padStart(2, '0')}`
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
      <View style={ styles.container }>
        <Text style={{ color: textColor }}>difficulty</Text>
                  <DateTimePicker
          testID="dateTimePicker"
          is24Hour={true}
          display="default"
          value={new Date()}
          mode="countdown"
        />
        <View style={{ margin: 30, flexDirection: "row", height: 50}}>
          {/* <TimerInput name="round time" time="3:00" />
          <TimerInput name="rest time" time="0:30" /> */}

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
            buttonStyle={ styles.button }
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
              
              this.props.navigation.navigate("PunchToStart")
            }}
          />
        </View>
      </View>
    );
  }
}

function FeedCard(props) {
  const { colors } = useTheme();
  // do we want to add a profile picture somewhere?
  // TODO should calculate combo length (duration) on the fly?
  // TODO this is limited to 3 for display purposes; we should animate this properly when user expands it
  // TODO why numToShow
  return (
    <View style={{ padding: 20, borderRadius: 15, backgroundColor: 'rgb(40, 40, 40)'}}>
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

function FeedScreen() {
  return (
    <ScrollView contentContainerStyle={ styles.container }>
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

    <View style={ styles.container }>
      <Text style={{ fontSize: 50, color: colors.text }}>debug screen</Text>
      <Text style={{ fontSize: 50, color: colors.text }}>DO NOT SHOW DURING DEMO</Text>
      <Button buttonStyle={ styles.button } title="punch" 
        onPress={() => {
          fetch(`${SERVER_IP}/punch`);
        }} />
    </View>

  );
}


const Tab = createBottomTabNavigator();
const ComboStack = createStackNavigator();
const FeedStack = createStackNavigator();

// TODO wtf this is terrible
const Feed = () => (
  <FeedStack.Navigator>
    <FeedStack.Screen name="FeedScreen" component={FeedScreen}  options={{ title: "Feed" }} />
  </FeedStack.Navigator>
);

const WorkoutScreen = () => (
  <ComboStack.Navigator>
    <ComboStack.Screen name="WorkoutList" component={WorkoutListScreen} options={{ title: "Workouts" }} />
    <ComboStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: "Workout" }} />
    <ComboStack.Screen name="Sparring" component={SparringScreen} options={{ title: "Sparring" }} />
    <ComboStack.Screen name="PunchToStart" component={PunchToStartScreen} options={{ title: "Punch to start" }} />
  </ComboStack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator initialRouteName="Feed">
        <Tab.Screen name="Feed" component={Feed} 
          options={{
            tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
          }}
        />
        <Tab.Screen name="Workouts" component={WorkoutScreen} 
          options={{
            tabBarIcon: ({ color }) => <Icon name="boxing-glove" color={color} type="material-community" />,
          }}
        />
        <Tab.Screen name="Activity" component={ActivityScreen} 
          options={{
            tabBarIcon: ({ color }) => <Icon name="trending-up" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: Colors.BACKGROUND_COLOR,
  },

  text: {
    color: 'rgb(225, 225, 225)',
  },

  button: {
    borderRadius: 15,
    backgroundColor: 'rgb(233, 37, 43)'
  },
  
  container: { 
    margin: "5%%",
  },

  title: {
    fontSize: 50,
    fontWeight: "800",
  }
});

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
