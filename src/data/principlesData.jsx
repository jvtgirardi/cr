import React from 'react';
import { Activity, Shield, Shuffle, Key, FileText } from 'lucide-react';

export const initialPrinciplesData = [
  {
    category: 'With Ball (Offensive Phase)',
    type: 'com-bola',
    icon: <Activity size={24} />,
    items: [
      {
        subCategory: 'Collective',
        principles: [
          { name: 'Width', description: 'Use the full width of the pitch, open the game on the flanks.' },
          { name: 'Depth', description: 'Attack towards the goal, with players attacking the space behind the defense.' },
          { name: 'Mobility', description: 'Constant position swapping to unbalance the marking.' },
          { name: 'Penetration', description: 'Actions to enter the defensive line (dribbling, 1-2 passing, through balls).' },
          { name: 'Support', description: 'Offer short and safe passing options to the ball carrier.' },
          { name: 'Switching Play', description: 'Change the side of play to exploit free spaces.' },
          { name: 'Tempo', description: 'Know when to accelerate and when to control possession.' },
          { name: 'Rational Occupation of Spaces', description: 'Distribute players well between sectors and corridors.' },
          { name: 'Organized Attack', description: 'Build up patiently from defense to attack.' },
        ]
      },
      {
        subCategory: 'Individual',
        principles: [
          { name: 'Support Movement', description: 'Short movement to receive facing the game.' },
          { name: 'Penetrating Movement', description: 'Deep runs behind the defensive line.' },
          { name: 'Perception & Decision Making', description: 'Choosing between passing, shooting, driving or dribbling.' },
          { name: 'Body Positioning', description: 'Protecting the ball, hold-up play, gaining position.' }
        ]
      }
    ]
  },
  {
    category: 'Without Ball (Defensive Phase)',
    type: 'sem-bola',
    icon: <Shield size={24} />,
    items: [
      {
        subCategory: 'Collective',
        principles: [
          { name: 'Compactness', description: 'Keep sectors (defense, midfield, attack) close.' },
          { name: 'Defensive Cover', description: 'Support the teammate making direct pressure.' },
          { name: 'Defensive Balance', description: 'Avoid being exposed in any sector, especially at the back.' },
          { name: 'Concentration', description: 'Full focus, especially on set pieces and upon losing the ball.' },
          { name: 'Pressure on Ball', description: 'Close down the opponent carrying the ball.' },
          { name: 'Depth Control', description: 'Push up or drop the defensive line to manage long balls.' },
          { name: 'Blocking Passing Lanes', description: 'Positioning to block opponent passing options.' },
          { name: 'Zonal Marking', description: 'Defend spaces, not just the man.' },
          { name: 'Man/Mixed Marking', description: 'Track specific opponents when necessary.' }
        ]
      },
      {
        subCategory: 'Individual',
        principles: [
          { name: 'Defensive Body Positioning', description: 'Orient the body to force the opponent into less dangerous areas.' },
          { name: 'Tackling Timing', description: 'Choose the right moment to attempt a tackle.' },
          { name: 'Anticipation', description: 'Read the play and get to the ball first.' }
        ]
      }
    ]
  },
  {
    category: 'Offensive Transition',
    type: 'transicao-ofensiva',
    icon: <Shuffle size={24} />,
    items: [
      {
        subCategory: 'Counter-attack',
        principles: [
          { name: 'Reaction to Recovery', description: 'React quickly upon winning the ball, exploiting the disorganized defense.' }
        ]
      }
    ]
  },
  {
    category: 'Defensive Transition',
    type: 'transicao-defensiva',
    icon: <Shuffle size={24} style={{ transform: 'scaleX(-1)' }} />,
    items: [
      {
        subCategory: 'Reaction to Loss',
        principles: [
          { name: 'Immediate Counter-Press', description: 'Immediate pressure or quick retreat to reorganize the defensive system.' },
          { name: 'Defensive Balance', description: 'Always keep players prepared for a potential turnover.' },
        ]
      }
    ]
  },
  {
    category: 'Set Pieces',
    type: 'bolas-paradas',
    icon: <Key size={24} />,
    items: [
      {
        subCategory: 'Offensive',
        principles: [
          { name: 'Free Kicks', description: 'Direct and indirect free kicks routines.' },
          { name: 'Corners', description: 'Planned routines, attacking the ball in the box.' }
        ]
      },
      {
        subCategory: 'Defensive',
        principles: [
          { name: 'Positioning', description: 'Defensive organization to prevent finishes.' },
          { name: 'Marking', description: 'Zonal or mixed marking during set pieces.' }
        ]
      }
    ]
  },
  {
    category: 'Team Organization',
    type: 'organizacao',
    icon: <Activity size={24} />,
    items: [
      {
        subCategory: 'Organization Principles',
        principles: [
          { name: 'Formation', description: 'Base structure (4-3-3, 4-4-2, 3-5-2 etc.).' },
          { name: 'Roles and Duties', description: 'Expectations for each player in every phase.' },
          { name: 'Defensive Lines', description: 'Block height: high, mid, or low.' },
          { name: 'Offensive and Defensive Cover', description: 'Compensating fullbacks/midfielders moving up.' },
          { name: 'Movement Synchronization', description: 'Moving up and down as a compact block.' },
          { name: 'On-pitch Communication', description: 'Directing, warning covers, type of marking.' }
        ]
      }
    ]
  },
  {
    category: 'Technical (Fundamentals)',
    type: 'tecnicos',
    icon: <FileText size={24} />,
    items: [
        {
          subCategory: 'Ball Control',
          principles: [
            { name: 'Ground Control', description: 'Using sole, inside/outside of foot, instep.' },
            { name: 'Aerial Control', description: 'Using chest, thigh, foot, and head.' },
            { name: 'Directional First Touch', description: 'Controlling while preparing the next action.' },
          ]
        },
        {
          subCategory: 'Passing',
          principles: [
            { name: 'Short Pass', description: 'Safety and possession maintenance.' },
            { name: 'Medium/Long Pass', description: 'Switching lanes, long balls.' },
            { name: 'Through Ball', description: 'Breaking marking lines.' },
            { name: 'One Touch Pass', description: 'Speeding up the play.' },
            { name: 'Passing Variety', description: 'Ground, mid-height, aerial, and different foot surfaces.' },
          ]
        },
        {
          subCategory: 'Dribbling and Driving',
          principles: [
            { name: 'Speed Driving', description: 'Advancing quickly with control.' },
            { name: 'Driving under Pressure', description: 'Keeping the ball with close marking.' },
            { name: 'Change of Direction', description: 'Sharp cuts, turns, pace changes.' },
            { name: 'Body Feints', description: 'Feinting without losing visual contact with the game.' },
            { name: 'Shielding Dribbles', description: 'Using the body to protect and turn on the defender.' },
          ]
        },
        {
          subCategory: 'Finishing',
          principles: [
            { name: 'Shooting', description: 'Dominant/non-dominant foot, accuracy and power.' },
            { name: 'First Time Finish', description: 'Shooting inside and outside the box immediately.' },
            { name: 'Attacking Header', description: 'Attacking the ball on crosses and corners.' },
            { name: 'Placed Finish', description: 'Prioritize placement in the corners, not just power.' },
            { name: 'Volleys and Overheads', description: 'More advanced shooting fundamentals.' },
          ]
        },
        {
          subCategory: 'Defensive Fundamentals',
          principles: [
            { name: 'Standing Tackle', description: 'Steal the ball without conceding a foul.' },
            { name: 'Challenge', description: 'Precise tackle at the right moment.' },
            { name: 'Interception', description: 'Game reading and positioning to cut passes.' },
            { name: '50/50 Challenge', description: 'Contesting the ball safely and firmly.' },
            { name: 'Defensive Header', description: 'Clearing aerial balls with direction and distance.' },
          ]
        },
        {
          subCategory: 'Goalkeeper Fundamentals',
          principles: [
            { name: 'Positioning', description: 'Alignment with the ball and center of goal.' },
            { name: 'Catching', description: 'Holding the ball securely.' },
            { name: 'Coming off the Line', description: 'On crosses (timing/decision) and 1v1 (reducing angle).' },
            { name: 'Distribution', description: 'With feet and hands to start attacks with quality.' },
          ]
        },
        {
          subCategory: 'Other Fundamentals',
          principles: [
            { name: 'Long Balls and Crossing', description: 'Accurate long deliveries and variations of crosses.' },
            { name: 'Body Use and Balance', description: 'Shielding, turning, physical duels.' },
            { name: 'Motor Coordination', description: 'Agility, reaction time, change of direction.' },
          ]
        }
    ]
  }
];
