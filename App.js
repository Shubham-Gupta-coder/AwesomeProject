import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Linking,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const NewsSummarizer = () => {
  const [query, setQuery] = useState(""); // State for user query
  const [articles, setArticles] = useState([]); // State for fetched articles
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error message (optional)

  const API_URL = "https://oevortex-webscout.hf.space/api/news"; // Replace with actual API URL

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null); // Clear any previous error

    const params = {
      q: query,
      max_results: 10,
      timelimit: "d",
      region: "wt-wt",
      safesearch: "moderate",
    };

    try {
      const response = await axios.get(API_URL, { params }); // Use Axios.get with params

      setArticles(response.data.results || []);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setError(error.message || "Error fetching news"); // Set user-friendly error message
    } finally {
      setIsLoading(false);
    }
  };

  const renderArticle = ({ item }) => (
    <View style={styles.article}>
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleBody}>{item.body}</Text>
      <TouchableOpacity // Optional: Style the button
        onPress={() => Linking.openURL(item.url)}
        style={{ backgroundColor: "#A994F8", padding: 10, borderRadius: 10 }}
      >
        <Text>Read Full Article</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>News Summarizer</Text>
      <SearchBar query={query} setQuery={setQuery} />
      <TouchableOpacity
        style={{ padding: 12, backgroundColor: "#A994F8", borderRadius: 20 }}
        onPress={fetchNews}
        disabled={isLoading}
      >
        <Text>Search</Text>
      </TouchableOpacity>
      {isLoading && <Text style={styles.loading}>Loading...</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {articles.length > 0 && (
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={(item) => item.url}
          style={styles.articleList}
        />
      )}
    </View>
  );
};

const SearchBar = ({ query, setQuery }) => (
  <TextInput
    style={styles.input}
    value={query}
    onChangeText={setQuery}
    placeholder="Enter your query..."
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: "#D7CEF8",
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    marginTop: 32,
    textAlign: "center",
    fontWeight: "bold",
    color: "#9377FA",
  },
  input: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
  },
  article: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderColor: "#D7CEF8",
    borderWidth: 5,
  },
  articleTitle: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
    padding: 5,
  },
  articleBody: {
    color: "#555",
    marginBottom: 15,
  },
  articleList: {
    marginTop: 10,
    padding: 20,
    borderRadius: 10,
  },
  loading: {
    marginBottom: 10,
  },
});

export default NewsSummarizer;
