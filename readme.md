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



For results we want to display the following information:

Elements:
- Name of the element (prefrebly the aria-label or truncated innter text)
- Attributes (hidden under dropdown)
- Computed styles (under some kind of dropdown or what not -- probably under the attributes drop)
- A few icons to show info about the element (possibly click to show -- WAY DOWN THE ROAD)
  - Does element have a shadow root? - (EV SHADOW, TAG, TEXTURE, GRID, STROKE FULL)
  - Does element have children? - (ACCOUNT CHILD, CRIB, TENANCY, DEVICE HUB, GRAPH 2)
  - Does element have text? (ABC, ARTICLE, DESCRIPTION, FORMAT SIZE, INSERT TEXT, SLAB SERIF, HDR AUTO)
  - Is the element interactable? - (HOV, TOUCH APP, LEFT CLICK, HIGHLIGHT MOUSE CURSOR)
  - Is the element visible? (VISIBILITY)