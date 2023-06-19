# Pokemon Catcher
Pokemon Catcher is a simple mobile app that allows users to create an account and collect their own Pokemon. Upon registration, users will receive three starter Pokemon, and they can capture more by searching and catching Pokemon in the game. Users have three chances to catch Pokemon, which reset automatically every 5 minutes. The app also displays the current user with the highest number of Pokemon in their account.

## Features
- Sign Up: Users can create an account by providing their information.
- Sign In: Registered users can log in to their accounts.
- Dashboard
    - Top Catcher: Displays the user with the highest number of captured Pokemon.
    - Recent Pokemons: Shows the recently captured Pokemon by the user.
    - Wild Pokemons: Displays a list of available Pokemon for users to capture.
- Pokemon List: Provides a comprehensive list of all Pokemon available in the game.
- My Pokemon List: Shows the collection of Pokemon captured by the user.
- Leaderboard: Displays the top users with the highest number of captured Pokemon.
- My Account: Allows users to view and update their account details.
- Sign Out: Enables users to log out from their accounts.
 

## Tools Used
 

- React Native Expo: A framework for developing mobile applications using React Native.
- PokeAPI: An API that provides data and information about Pokemon.
- Firebase:
    - User Authentication: Firebase's authentication service is used for user registration, login, and password reset.
    - Real-time Database: Firebase's real-time database is utilized to store and manage user data.

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

## Getting Started
To run the Pokemon Catcher app locally, follow these steps:

Clone the repository: git clone [repository URL]

Navigate to the project directory: cd pokemon-catcher

Install the dependencies: 

```sh
cd pokemon-catcher
npm install or yarn install
```

###### Set up Firebase:
Create a new project on the Firebase console.
Enable the Authentication service and set up the necessary authentication methods.
Enable the Realtime Database service.
Retrieve the Firebase configuration details.

###### Set up PokeAPI:
Obtain an API key from the PokeAPI website.
Copy the API key for future use.

###### Configure the app:
Create a new file named .env in the project's root directory.
Add the following configuration details to the .env file:

```sh
FIREBASE_API_KEY=[your Firebase API key]
FIREBASE_AUTH_DOMAIN=[your Firebase auth domain]
FIREBASE_DATABASE_URL=[your Firebase database URL]
FIREBASE_PROJECT_ID=[your Firebase project ID]
FIREBASE_STORAGE_BUCKET=[your Firebase storage bucket]
FIREBASE_MESSAGING_SENDER_ID=[your Firebase messaging sender ID]
FIREBASE_APP_ID=[your Firebase app ID]
POKEMON_API_BASE_URL=https://pokeapi.co/api/v2/
POKEMON_API_KEY=[your PokeAPI key]
```

Start the app: 
```sh
npm start or yarn start
```

## Screenshots
##### AuthScreen 
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/AuthScreen.jpg?raw=true =250x)
##### SignUpScreen
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/SignUpScreen.jpg?raw=true =250x)
##### ForgotPasswordScreen
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/ForgotPasswordScreen.jpg?raw=true =250x)
##### HomeScreen
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/HomeScreen.jpg?raw=true =250x)
##### LeaderBoardScreen
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/LeaderBoardScreen.jpg?raw=true =250x)
##### MyAccountScreen
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/MyAccountScreen.jpg?raw=true =250x)
##### MyPokemonScreen
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/MyPokemonScreen.jpg?raw=true =250x)
##### PokemonDetailScreen-Abilities
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/PokemonDetailScreen-Abilities.jpg?raw=true =250x)
##### PokemonDetailScreen-Capture-Loading
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/PokemonDetailScreen-Capture-Loading.jpg?raw=true =250x)
##### PokemonDetailScreen-Captured-Failed
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/PokemonDetailScreen-Captured-Failed.jpg?raw=true =250x)
##### PokemonDetailScreen-Captured-Success
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/PokemonDetailScreen-Captured-Success.jpg?raw=true =250x)
##### PokemonDetailScreen-Captured
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/PokemonDetailScreen-Captured.jpg?raw=true =250x)
##### PokemonDetailScreen-Items
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/PokemonDetailScreen-Items.jpg?raw=true =250x)
##### PokemonDetailScreen-Moves
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/PokemonDetailScreen-Moves.jpg?raw=true =250x)
##### PokemonDetailScreen-Stats
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/PokemonDetailScreen-Stats.jpg?raw=true =250x)
##### PokemonListScreen
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/PokemonListScreen.jpg?raw=true =250x)
##### SideDrawer
![Alt text](https://github.com/roellongcop/pokemon/blob/main/screenshots/SideDrawer.jpg?raw=true =250x)
##### SplashScreen
![Alt text](https://github.com/roellongcop/pokemon/blob/main/assets/splash.png?raw=true =250x)





