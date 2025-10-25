const e=`# Game CLI Builder

This library gives the developer means to create their own custom command interfaces mapping commands to actions, which the user of the app can use to interact with the app.

The Custom Command Interface(CCI) can be structured in different sections which are called contexts or access points. The idea of a context is to provide a space where commands can be somehow grouped meaningfully. There wont be a limitation of how the contexts should be structured. The structure can be tree like or graph like. That would depend on the CCI builder.

Example of tree like command interface giving access to different contextually meaningful set of commands

\`\`\`text
         | - coffee shop( commands: go back, look around, order a coffee, sit on a table <which one>, etc..)
lobby -
         | - elevator (commands: go back, look around, press a button <number>, etc...)
\`\`\`

Example of graph like structure:

\`\`\`text
            | - bedroom ( commands: go back, go corridor, go bathroom, )
kitchen -
            | - bathroom (command: go back, go corridor, go to bedroom)

\`\`\`

The developer has to:

- provide the custom command interface structure
- provide implementation for each of the mapped actions and execute the action whenever the command results into an action

There are two types of commands:

- regular commands which the user sends with possible additional parameters, which is directly mapped to an action
- commands which navigates the user between different contextually separate but meaningfully connected sections of the command structure, thus allowing the user to access the contextually grouped regular commands. Lets called those commands contexts or access points(APs)

There are few implicit commands, which can be overwritten with custom. They are implmented for convinence only to facilitate navigation

- back
- help

AUTOCOMPLETION:

- works only for commands and not for aliases
-
`;export{e as default};
