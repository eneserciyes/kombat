module Game exposing (..)

{-| This file handles all the game logic and provides the Gameplay interface to the Main application.alias.

The core parts you need to implement are:

1.  A type for your Game model
2.  An initialisation function that takes a Settings record and returns a Game record
3.  A Msg type that represents all the possible messages that can be sent from the interface to the game logic
4.  An update function that takes a Msg and a Game and returns a new Game
5.  A view function that takes a Game and returns Html Msg (the interface for the game)

You'll probably want to implement a lot of helper functions to make the above easier.

-}

import Common exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import List exposing (..)
import Settings exposing (..)
import Array exposing (Array)


--------------------------------------------------------------------------------
-- GAME MODEL
--------------------------------------------------------------------------------


{-| A record type which contains all of the game state.

This needs to be sufficiently detailed to represent the entire game state, i.e.
if you save this record, turn off your computer, and then reload this record,
you should be able to pick up the game exactly where you left off.

We also need some metadata including the settings used to initialise
the game, the status (whether it's still going or completed), and
whose turn it currently is.

You might also like to pre-calculate some data and store it here
if you will use it a lot.

-}
type alias Game =
    { settings : Settings
    , status: Status
    , phase: Phase
    , table: Array TennisPlayer
    , player1_stats: PlayerStats
    , player2_stats: PlayerStats
    , turn : Player
    }

-- TennisPlayer type
type alias TennisPlayer
    = {
        name : String,
        strength: Int,
        price: Int
    }

type alias PlayerStats
    = {
        score: Int,
        deck: Array TennisPlayer,
        current_budget: Int
    }

{-| Create the initial game data given the settings.
-}
init : Settings -> ( Game, Cmd Msg )
init settings =
    let
        initialGame =
            { settings = settings
            , status = Playing
            , turn = Player1
            , table = Array.empty -- TODO: populate with players
            , player1_stats = { deck = Array.empty, score = 0, current_budget = settings.budget }
            , player2_stats = { deck = Array.empty, score = 0, current_budget = settings.budget }
            }
    in
    ( initialGame, Cmd.none )



--------------------------------------------------------------------------------
-- GAME LOGIC
--------------------------------------------------------------------------------


{-| The possible moves that a player can make.
-}
type Move
    = SelectTennisPlayer Player TennisPlayer
    | PutPlayerOnTable Player TennisPlayer


{-| Apply a move to a game state, returning a new game state.
-}
applyMove : Move -> Game -> Game
applyMove move game =
    case move of
        SelectTennisPlayer player tennis_player ->
            case player of 
                Player1 ->
                    let 
                        newPlayerDeck = Array.push tennis_player game.player1_stats.deck 
                        updatedTable = Array.filter (\p -> p.name /= tennis_player.name) game.table
                        playerStats = game.player1_stats
                    in { game | table=updatedTable, player1_stats = {playerStats | deck = newPlayerDeck, current_budget = playerStats.current_budget - tennis_player.price}, turn = Player2}
                Player2 -> 
                    let 
                        newPlayerDeck = Array.push tennis_player game.player2_stats.deck 
                        updatedTable = Array.filter (\p -> p.name /= tennis_player.name) game.table
                        playerStats = game.player2_stats
                    in { game | table=updatedTable, player2_stats = {playerStats | deck = newPlayerDeck, current_budget = playerStats.current_budget - tennis_player.price}, turn = Player1} 



--------------------------------------------------------------------------------
-- INTERFACE LOGIC
--
-- This section deals with how to map the interface to the game logic.
--
-- Msg contains messages that can be sent from the game interface. You should then
-- choose how to handle them in terms of game logic.
--
-- This also sets scaffolding for the computer players - when a computer player
-- makes a move, they generate a message (ReceivedComputerMove) which is then handled
-- just like a player interacting with the interface.
--------------------------------------------------------------------------------


{-| An enumeration of all messages that can be sent from the interface to the game
-}
type Msg
    = ClickedIncrement
    | ClickedDecrement


{-| A convenience function to pipe a command into a (Game, Cmd Msg) tuple.
-}
withCmd : Cmd Msg -> Game -> ( Game, Cmd Msg )
withCmd cmd game =
    ( game, cmd )


{-| The main update function for the game, which takes an interface message and returns
a new game state as well as any additional commands to be run.
-}
update : Msg -> Game -> ( Game, Cmd Msg )
update msg game =
    case msg of
        ClickedIncrement ->
            game
                |> applyMove Increment
                |> withCmd Cmd.none

        ClickedDecrement ->
            game
                |> applyMove Decrement
                |> withCmd Cmd.none



--------------------------------------------------------------------------------
-- GAME VIEW FUNCTION
--------------------------------------------------------------------------------


{-| The main view function that gets called from the Main application.

Essentially, takes a game and projects it into a HTML interface where Messages
can be sent from.

-}
view : Game -> Html Msg
view game =
    div [ id "game-screen-container" ]
        [ h1 [id "counter-value"] [ text (String.fromInt game.count) ]
        , div [id "counter-buttons"]
            [ button [ onClick ClickedDecrement ] [ text "-" ]
            , button [ onClick ClickedIncrement ] [ text "+" ]
            ]
        ]
