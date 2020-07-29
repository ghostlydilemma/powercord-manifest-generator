import React from 'react';
import "./App.css";
import { ThemeHeader } from './layout/Nav/Header/ThemeHeader';
import { GeneratorHeader } from './layout/Nav/Header/GeneratorHeader';
import { GenProvider } from "./GenContext";
import { ThemeProvider } from "./ThemeContext";

function App() {
  const Tabs = Object.freeze({ THEMES: 'Themes', PLUGINS: 'Plugins', INFO: 'Info' })
  const Themes = Object.freeze({ DARK: 'Dark Theme', LIGHT: 'Light Theme', Revamped: 'Discord Revamped' })
  const [selectedThemeTab, setSelectedThemeTab] = React.useState(Themes.DARK)
  const [selectedGenTab, setSelectedGenTab] = React.useState(Tabs.PLUGINS)

  return (

    <ThemeProvider value={{ selectedThemeTab, selectTab: (tab) => setSelectedThemeTab(tab) }}>


    </ThemeProvider>


    <div>

      <GeneratorHeader />
      <ThemeHeader />
    </div>
  );
}

export default App;
