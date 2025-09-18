import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClients";
import QuizList from "./components/QuizList";
import QuizTaking from "./components/QuizTaking";
import QuizResults from "./components/QuizResults";
import "./App.css";

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>TypeScript Quiz App</h1>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<QuizList />} />
              <Route path="/quiz/:id" element={<QuizTaking />} />
              <Route path="/results/:id" element={<QuizResults />} />
            </Routes>
          </main>
        </div>
      </Router>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
