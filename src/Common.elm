module Common exposing (..)

{-| This module contains code shared in Settings, Main and Game.

It's a good place to store the really basic types and functions.

Importantly, if you have a type/function that's used in both Settings.elm and Game.elm,
I strongly suggest putting it here (to avoid circular dependencies).

You can delete any of the functions currently defined here - I just thought
they'd be useful for a lot of different types of games. 

-}

--------------------------------------------------------------------------------
-- TYPES
--------------------------------------------------------------------------------


{-| Basic type representation for a two player game.
-}
type Player
    = Player1
    | Player2

type alias Outcome 
    = {
        winner: Player,
        name: String
    }
{-| A game is either in progress of complete.
-}
type Status
    = Playing
    | Complete Outcome -- name of the winner of the game

-- Phase: Selecting players or playing matches
type Phase
    = SelectingPlayers
    | PlayingMatches

--------------------------------------------------------------------------------
-- CONVENIENCE FUNCTIONS
--------------------------------------------------------------------------------


{-| A convenience function for the opposite player.
-}
opponent : Player -> Player
opponent player =
    case player of
        Player1 ->
            Player2

        Player2 ->
            Player1
