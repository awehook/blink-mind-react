A mind map library for react  write in  typescript which use immutable.js for state management.

The mind map can drag to any area of the view container area. 

Editing a node with a rich text editor.

### Futures
1. drag and move

![image](./screenshots/drag-and-move.gif)

2. drag and drop for reorganize the node relationship

![image](./screenshots/drag-and-drop.gif)

3. popup menu for operation the node

![image](./screenshots/node-popup-menu.gif)

4. rich text editor for mind map item

![image](./screenshots/rich-edit.jpg)

### Usage
In your project, run the command
```
yarn add blink-mind-react
```

### Run the Demo
```
yarn
yarn storybook
```
Then open http://localhost:6006/ .
Click the demo1 menu item.
![image](./screenshots/open-demo.jpg)



### Dependency

This library integrate the [rich-markdown-editor](https://github.com/outline/rich-markdown-editor) which url is https://github.com/outline/rich-markdown-editor.
I have modified some code of rich-markdown-editor.
And this library used the library which forked from [rich-markdown-editor](https://github.com/outline/rich-markdown-editor) and modified some code by me.
The forked library's url is https://github.com/awehook/rich-markdown-editor.
