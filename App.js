import * as React from 'react';
import { ScrollView, View, StyleSheet, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Badge, Card, Text, ListItem, Icon, Button, Input, Avatar, Divider } from 'react-native-elements'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { useTheme } from '@react-navigation/native'

import Colors from './constants/Colors';

const SERVER_IP = "http://35.173.125.185"

// TODO settle on either "training" or "workout" throughout

// TODO we really shouldn't make this a global, but...
const textColor = 'rgb(225, 225, 225)'

// TODO change combos
// Map ID to combo
// TODO figure out this text
const combos = new Map();
combos.set(0, { title: "Flora's warmup", user: "flora", id: 0, moves: [
  {name: "slow jab", speed: 0.3, extension: 1, duration: 1}, 
  {name: "quick jab", speed: 1, extension: 1, duration: 1}, 
  {name: "feint", speed: 0.7, extension: 0.3, duration: 1}, 
  {name: "slow jab", speed: 0.3, extension: 1, duration: 1}, 
  {name: "quick jab", speed: 1, extension: 1, duration: 1}, 
  {name: "feint", speed: 0.7, extension: 0.3, duration: 1}], duration: 45 });
combos.set(1, { title: "Drew's warmup", user: "drew", id: 1, moves: [{name: "quick jab", speed: 1, extension: 1, duration: 1}, {name: "full punch", speed: 0.5, extension: 0.4, duration: 1}], duration: 15 });
combos.set(2, { title: "Joush's warmup", user: "joush", id: 0, moves: [{name: "quick jab", speed: 1, extension: 0.7, duration: 1}, {name: "full punch", speed: 0.7, extension: 1, duration: 1}, {name: "feint", speed: 1, extension: 0.3, duration: 1}, {name: "quick jab", speed: 1, extension: 0.7, duration: 1}, {name: "full punch", speed: 0.7, extension: 1, duration: 1}, {name: "feint", speed: 1, extension: 0.3, duration: 1}], duration: 45 });

const users = new Map();
users.set("flora", { name: "Flora Klise", description: "Spartan expert", picture: "https://firebasestorage.googleapis.com/v0/b/mit2s009.appspot.com/o/profiles%2Fthumb_fklise.jpg?alt=media&token=d3e7040e-4838-477d-9df2-7deb850a76b1" })
users.set("drew", { name: "Drew Callahan", description: "Spartan trainer", picture: "https://firebasestorage.googleapis.com/v0/b/mit2s009.appspot.com/o/profiles%2Fthumb_andrewbc.jpg?alt=media&token=c7315a11-e854-4686-bf6f-26926f3270f1" })
users.set("joush", { name: "Joush Padilla", description: "Spartan extraordinaire", picture: "https://firebasestorage.googleapis.com/v0/b/mit2s009.appspot.com/o/profiles%2Fthumb_jgp7.jpg?alt=media&token=98bc24c8-fdb7-4221-876a-323a1ef748a7" })

function secondsToTimestring(seconds) {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
}

function AvatarWithSubtitle(props) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: props.reversed ? "row-reverse" : "row", justifyContent: "flex-start", marginBottom: 10 }}>
      <Avatar rounded size="medium" source={{ uri: props.uri }} />
      <View style={{ flexDirection: "column", marginHorizontal: 10, justifyContent: "center" }}>
        <Text style={[ styles.text, styles.usernameText, { textAlign: props.reversed ? "right" : "left" }]}>{props.name}</Text>
        <Text style={[ styles.text, { textAlign: props.reversed ? "right" : "left" }]}>{props.subtitle}</Text>
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
  const user = users.get(props.combo.user);

  return (
    <View style={{ marginBottom: 30, padding: 20, borderRadius: 15, backgroundColor: 'rgb(40, 40, 40)'}}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "column" }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>{props.combo.title}</Text>
          <Text style={{ color: colors.text, marginBottom: 20 }}>{props.combo.moves.length} moves, {secondsToTimestring(props.combo.duration)} minutes</Text>
        </View>
        <View>
          
      <AvatarWithSubtitle reversed subtitle={user.description} name={user.name} uri={user.picture} />
        </View>
      </View>

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
      <Text style={[ styles.text, styles.title, { marginBottom: 20 } ]}>
        Start workout
      </Text>
      <WorkoutCard combo={route.params.combo} key={route.params.id} numToShow={undefined} />
      <Button 
        buttonStyle={[ styles.button, styles.trainingButton ]} 
        titleStyle={[ styles.text, styles.trainingButtonTitle ]}
        title="Begin training" onPress={
          () => {
            // const data = { spar: true };

            // fetch(`${SERVER_IP}/spar`, {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify(data),
            // });

            navigation.navigate("WorkoutList")
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
      <Text style={[ styles.text, styles.title ]}>
        Workouts
      </Text>
      {/* <Button buttonStyle={styles.button} onPress={() => navigation.navigate("Sparring")} title="Start sparring" /> */}
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Sparring")}>
        <SparringCard />
      </TouchableWithoutFeedback>
      {/* <Text style={{ color: colors.text, textAlign: "center" }}>or choose from a workout below</Text> */}
      <Divider style={{ marginVertical: 15 }} />
      <Text style={[ styles.text, { fontSize: 35, fontWeight: "700", marginBottom: 20 } ]}>
        Saved workouts
      </Text>
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

function SparringCard() {
  return (
    <View style={{ marginVertical: 15, padding: 20, borderRadius: 15, backgroundColor: 'rgb(40, 40, 40)'}}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "column" }}>
          <Text style={[ styles.text, { fontSize: 24, fontWeight: 'bold' }]}>Sparring mode</Text>
          <Text style={[ styles.text, { marginBottom: 20, fontSize: 18 } ]}>Jump right into a session with randomized punches. We'll bring the hits, you bring the moves.</Text>
        </View>
      </View>

      {/* <View style={{ backgroundColor: 'rgb(60, 60, 60)', borderRadius: 15, padding: 20, marginTop: 15 }}> */}
      <View style={{ backgroundColor: 'rgb(233, 37, 43)', borderRadius: 15, padding: 20, marginTop: 15 }}>
        <Text style={[ styles.text, { fontSize: 25, fontWeight: "600", textAlign: "center" } ]}>
          Start sparring
        </Text>
      </View>
    </View>
  );
}

class SparringScreen extends React.Component {
  // TODO should we save default values from last time, to use this time?
  state = {
    // TODO what order should these be in? also what order on the screen
    difficulty: 1,

    roundTime: "300",
    restTime: 30,
    numRounds: 3,
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={[ styles.text, styles.title ]}>
        Sparring
      </Text>

        <View style={{ backgroundColor: 'rgb(40, 40, 40)', padding: 20, marginVertical: 30, borderRadius: 15 }}>
          <View>
            <Text style={[ styles.text, { fontSize: 30, fontWeight: '600' } ]}>Difficulty</Text>
            <ListItem onPress={() => this.setState({ difficulty: 0 })}
              containerStyle={{ backgroundColor: this.state.difficulty === 0 ? 'rgb(60, 60, 60)' : 'rgb(40, 40, 40)', borderRadius: 15 }} >
              <Icon name="thermometer-empty" type="font-awesome" color='rgb(225, 225, 225)' size={35} />
              <ListItem.Content>
                <ListItem.Title style={styles.text}>Beginner</ListItem.Title>
              </ListItem.Content>
              {/* <Text style={[ styles.text, { fontStyle: "italic" } ]}>Easy warmup</Text> */}
              {this.state.difficulty == 0 &&
                <ListItem.CheckBox checked checkedIcon="check" checkedColor='rgb(233, 37, 43)' />
              }
            </ListItem>
            <ListItem onPress={() => this.setState({ difficulty: 1 })}
              containerStyle={{ backgroundColor: this.state.difficulty === 1 ? 'rgb(60, 60, 60)' : 'rgb(40, 40, 40)', borderRadius: 15 }} >
              <Icon name="thermometer-half" type="font-awesome" color='rgb(225, 225, 225)' size={35} />
              <ListItem.Content>
                <ListItem.Title style={styles.text}>Intermediate</ListItem.Title>
              </ListItem.Content>
              {/* <Text style={[ styles.text, { fontStyle: "italic" } ]}></Text> */}
              {this.state.difficulty == 1 &&
                <ListItem.CheckBox checked checkedIcon="check" checkedColor='rgb(233, 37, 43)' />
              }
            </ListItem>
            <ListItem onPress={() => this.setState({ difficulty: 2 })}
              containerStyle={{ backgroundColor: this.state.difficulty === 2 ? 'rgb(60, 60, 60)' : 'rgb(40, 40, 40)', borderRadius: 15 }} >
              <Icon name="thermometer-full" type="font-awesome" color='rgb(225, 225, 225)' size={35} />
              <ListItem.Content>
                <ListItem.Title style={styles.text}>Advanced</ListItem.Title>
              </ListItem.Content>
              {/* <Text style={[ styles.text, { fontStyle: "italic" } ]}>Turn up the heat</Text> */}
              {this.state.difficulty == 2 &&
                <ListItem.CheckBox checked checkedIcon="check" checkedColor='rgb(233, 37, 43)' />
              }
            </ListItem>
          </View>
        </View>

        <View style={{ margin: 50, flexDirection: "row", height: 50 }}>
          {/* <TimerInput name="round time" time="3:00" />
          <TimerInput name="rest time" time="0:30" /> */}

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, textAlign: "center", color: textColor }}>round time</Text>
            <Input containerStyle={{ flex: 1 }} inputContainerStyle={{ borderBottomWidth: 0 }}
              style={{ textAlign: "center", fontSize: 30, color: textColor }}
              keyboardType="numeric"

              returnKeyType="done"
              defaultValue={"3:00"}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, textAlign: "center", color: textColor }}>rest time</Text>
            <Input containerStyle={{ flex: 1 }} inputContainerStyle={{ borderBottomWidth: 0 }}
              style={{ textAlign: "center", fontSize: 30, color: textColor }}
              keyboardType="numeric"

              returnKeyType="done"
              defaultValue={"0:30"}
            />
          </View>
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
          <Button
            buttonStyle={[ styles.button, styles.trainingButton ]}
            titleStyle={[ styles.text, styles.trainingButtonTitle ]}
            title="Begin training"
            onPress={() => {
              const data = { spar: true };

              fetch(`${SERVER_IP}/spar`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
              });
              
              this.props.navigation.navigate("WorkoutList")
            }}
          />
      </View>
    );
  }
}

function FeedPhotoCard(props) {
  const { colors } = useTheme();

  return (
    <View style={{ padding: 20, borderRadius: 15, marginVertical: 15, backgroundColor: 'rgb(40, 40, 40)'}}>
      <AvatarWithSubtitle subtitle={props.subtitle} name={props.name} uri={props.picture} />
      <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
        {props.photos.map(photo => <Image source={{ uri: photo }} 
          style={{ width: 340, height: 400, overflow: "hidden", borderRadius: 15 }}
        />)}

      </View>
    </View>
  );
}

function FeedCard(props) {
  const { colors } = useTheme();
  // do we want to add a profile picture somewhere?
  // TODO should calculate combo length (duration) on the fly?
  // TODO this is limited to 3 for display purposes; we should animate this properly when user expands it
  // TODO why numToShow
  return (
    <View style={{ padding: 20, borderRadius: 15, marginVertical: 15, backgroundColor: 'rgb(40, 40, 40)'}}>
      <AvatarWithSubtitle subtitle={props.subtitle} name={props.name} uri={props.picture} />
      <View style={{ backgroundColor: 'rgb(60, 60, 60)',  borderRadius: 15, flexDirection: "row", alignItems: "center", width: "100%" }}>
        {props.achievement && <Image source={ require('./assets/achievement-trophy.png') } 
          style={{ width: 50, height: 50, margin: 10 }}
        />}
        <View style={{ flexDirection: "column", justifyContent: "flex-start", padding: 10 }}>
          {props.title && <Text style={{ color: colors.text, fontSize: 20, fontWeight: "600",  }}>{props.title}</Text>}
          <Text style={{ color: colors.text, fontSize: 15, }}>{props.description}</Text>
        </View>
      </View>
    </View>
  );
}

function FeedScreen() {
  return (
    <ScrollView contentContainerStyle={ styles.container }>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[ styles.text, styles.title ]}>
          Feed
        </Text>
        <Avatar rounded size="medium" source={{ uri: users.get('flora').picture }} containerStyle={{ alignSelf: "center" }} />
      </View>
      <FeedCard subtitle="earned an achievement" description="Top your local Spartan leaderboards for three weeks in a row" title="Spartan master" name="Joush Padilla" picture={users.get('joush').picture} achievement />
      <FeedPhotoCard subtitle="posted some photos" description="Got a pretty sweet workout with Spartan today!" name="Drew Callahan" picture={users.get('drew').picture} photos={["https://i.imgur.com/vYtb2ya.jpg", "https://i.imgur.com/F9LGY06.jpg"]} />
      <FeedCard subtitle="earned an achievement" description="Beat the red critter in a boxing match" title="Spartacus" name="Joush Padilla" picture={users.get('joush').picture} achievement />
    </ScrollView>
  );
}

function ActivityScreen() {
  const { colors } = useTheme();

  return (
    <View style={ styles.container }>
      <Text style={{ fontSize: 50, color: colors.text }}>debug screen</Text>
      <Text style={{ fontSize: 50, color: colors.text }}>@drew: don't fuck this up ;)</Text>
      <Button buttonStyle={[ styles.button, { marginVertical: 20 } ]} title="punch" titleStyle={{ fontSize: 50 }}
        onPress={() => {
          fetch(`${SERVER_IP}/punch`);
        }} />
      <Button buttonStyle={[ styles.button, { marginVertical: 20 } ]} title="punch x2" titleStyle={{ fontSize: 50 }}
        onPress={() => {
          fetch(`${SERVER_IP}/doublepunch`);
        }} />
      <Button buttonStyle={[ styles.button, { marginVertical: 20 } ]} title="feint" titleStyle={{ fontSize: 50 }}
        onPress={() => {
          fetch(`${SERVER_IP}/feint`);
        }} />
      <Button buttonStyle={[ styles.button, { marginVertical: 20 } ]} title="start combo" titleStyle={{ fontSize: 50 }}
        onPress={() => {
          fetch(`${SERVER_IP}/docombo`);
        }} />
      <Button buttonStyle={[ styles.button, { marginVertical: 20 } ]} title="stop sparring" titleStyle={{ fontSize: 50 }}
        onPress={() => {
          const data = { spar: false };

          fetch(`${SERVER_IP}/spar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
        }} />
      {/* TODO make button that punches twice <Button buttonStyle={ styles.button } title="punch x2" 
        onPress={() => {
          fetch(`${SERVER_IP}/command`);
        }} /> */}
    </View>
  );
}


function LogoTitle() {
  return (
    <Image
      style={{ width: 164, height: 42 }}
      source={require('./assets/logoWhite.png')}
    />
  );
}

const Tab = createBottomTabNavigator();
const ComboStack = createStackNavigator();
const FeedStack = createStackNavigator();

// TODO wtf this is terrible
const Feed = () => (
  <FeedStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: 'rgb(233, 37, 43)'
    },

    headerTintColor: 'rgb(225, 225, 225)',
  }}>
    <FeedStack.Screen name="FeedScreen" component={FeedScreen} options={{ headerTitle: props => <LogoTitle {...props} /> }} />
  </FeedStack.Navigator>
);

const WorkoutScreen = () => (
  <ComboStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: 'rgb(233, 37, 43)'
    },

    headerTintColor: 'rgb(225, 225, 225)',
  }}>
    <ComboStack.Screen name="WorkoutList" component={WorkoutListScreen} options={{ title: "", headerTitle: props => <LogoTitle {...props} /> }} />
    <ComboStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: "", headerTitle: props => <LogoTitle {...props} /> }} />
    <ComboStack.Screen name="Sparring" component={SparringScreen} options={{ title: "", headerTitle: props => <LogoTitle {...props} /> }} />
    <ComboStack.Screen name="PunchToStart" component={PunchToStartScreen} options={{ title: "", headerTitle: props => <LogoTitle {...props} /> }} />
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

  usernameText: {
    color: 'rgb(225, 225, 225)',
    fontWeight: "800",
  },

  button: {
    borderRadius: 15,
    backgroundColor: 'rgb(233, 37, 43)'
  },
  
  container: { 
    margin: "5%",
    marginTop: "2%"
  },

  title: {
    fontSize: 50,
    fontWeight: "800",
  },

  trainingButton: {
    width: "50%", alignSelf: "center"
  },

  trainingButtonTitle: {
    fontSize: 25,
    fontWeight: "600"
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
