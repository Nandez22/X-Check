# An xPath Tester For FireFox! (Hopefully)

## Goals

- Styling and details for Element results
- Handling for other node types
- Handling for non-node types

Notes to self:

so we get results back in a result object
that object can be of many types but there are two that we need to worry about: 
- itterators
- Snapshots

both we have a method for packaging since they contain basically the same thing

For each of the nodes within either group we need to:
- Serialize
- Highlight
- Apply UID

