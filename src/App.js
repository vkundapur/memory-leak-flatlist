/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import type { Node } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import { Button, SearchBar, useTheme } from 'react-native-elements';
import { searchBooks } from './api/GoogleBooksService';
import HttpClient from './network/HttpClient';
import BookCard from './components/BookCard';

const searchParamsInitialState = {
    startIndex: 1,
    maxResults: 12,
    totalItems: null,
};

let debounceTimer;
const debounce = (callback, time) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, time);
};

const isEndOfList = searchParams => {
    const { startIndex, maxResults, totalItems } = searchParams;
    if (totalItems == null) {
        return false;
    }
    console.log('isEndOfList', totalItems - (startIndex - 1 + maxResults) < 0);
    return totalItems - (startIndex - 1 + maxResults) < 0;
};

const App: () => Node = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [globalSearchResults, setGlobalSearchResults] = useState([]);
    const [searchParams, setSearchParams] = useState(searchParamsInitialState);

    let searchCancelToken;
    let searchCancelTokenSource;

    // This ref will be used to track if the search Term has changed when tab is switched
    const searchRef = useRef();

    const clearSearch = () => {
        console.log('Clear everything!');
        searchRef.current = null;
        setGlobalSearchResults([]);
        setSearchParams(searchParamsInitialState);
        setIsLoading(false);
        searchCancelTokenSource?.cancel();
        searchCancelToken = null;
        searchCancelTokenSource = null;
    };

    useEffect(() => {
        debounce(async () => {
            setIsLoading(true);
            await searchGlobal(searchTerm);
            setIsLoading(false);
        }, 1000);
    }, [searchTerm]);

    /**
     * Search method
     */
    const searchGlobal = async text => {
        if (!text) {
            // Clear everything
            clearSearch();
            return;
        }
        setIsLoading(true);
        try {
            // Use the initial state values if the search term has changed
            let params = searchParams;
            if (searchRef.current !== searchTerm) {
                params = searchParamsInitialState;
            }

            const { items, totalItems } = await searchBooks(
                text,
                params.startIndex,
                params.maxResults,
                searchCancelTokenSource?.token,
            );
            if (searchRef.current === searchTerm) {
                console.log('Search term has not changed. Appending data');
                setGlobalSearchResults(prevState => prevState.concat(items));
                setSearchParams(prevState => ({
                    ...prevState,
                    startIndex: prevState.startIndex + prevState.maxResults,
                    totalItems,
                }));
            } else {
                console.log(
                    'Search term has changed. Updating data',
                    searchTerm,
                );
                if (!searchTerm) {
                    console.log('!searchTerm', searchTerm);
                    clearSearch();
                    return;
                }
                setGlobalSearchResults(items);
                setSearchParams({
                    ...searchParamsInitialState,
                    startIndex:
                        searchParamsInitialState.startIndex +
                        searchParamsInitialState.maxResults,
                    totalItems,
                });
            }
            searchRef.current = text;
        } catch (err) {
            if (HttpClient.isCancel(err)) {
                console.error('Cancelled', err.message);
            }
            console.error(`Error searching for "${text}"`, err);
        }
        setIsLoading(false);
    };

    const renderGlobalItems = ({ item }) => {
        return <BookCard book={item} />;
    };

    const { theme } = useTheme();

    return (
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <View style={styles.container}>
                <SearchBar
                    showLoading={isLoading}
                    placeholder="Enter search term here"
                    onChangeText={text => {
                        setSearchTerm(text);
                    }}
                    value={searchTerm}
                    platform={Platform.OS}
                />
                {isLoading && (
                    <ActivityIndicator animating style={styles.loader} />
                )}
                {globalSearchResults.length > 0 && (
                    <FlatList
                        removeClippedSubviews
                        columnWrapperStyle={styles.columnWrapper}
                        data={globalSearchResults}
                        numColumns={3}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item + item.id}
                        renderItem={renderGlobalItems}
                        ListFooterComponent={
                            <>
                                {!isLoading &&
                                    !isEndOfList(searchParams) &&
                                    searchParams.totalItems > 0 && (
                                        <Button
                                            type="clear"
                                            title="Load more..."
                                            onPress={async () => {
                                                await searchGlobal(searchTerm);
                                            }}
                                        />
                                    )}
                                {isLoading && searchParams.totalItems != null && (
                                    <ActivityIndicator
                                        size="large"
                                        style={{
                                            justifyContent: 'center',
                                        }}
                                        color={theme.colors.primary}
                                    />
                                )}
                            </>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backgroundStyle: 'white',
    container: {
        height: '100%',
        width: '100%',
    },
    columnWrapper: {
        flex: 1,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default App;
