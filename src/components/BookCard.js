/* eslint-disable react/forbid-prop-types */
import React, { memo } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Image,
    makeStyles,
    Rating,
    Text,
    useTheme,
} from 'react-native-elements';

import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import PropTypes from 'prop-types';
import { getCoverUri } from '../Utils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const cardWidth = SCREEN_WIDTH / 3 - 16;

const BORDER_RADIUS = 8;

const BookCard = props => {
    const { book, showInfoOverlay = true } = props;

    const { averageRating } = book;

    const coverUri = getCoverUri(book);

    const { theme } = useTheme();
    const styles = useStyles(props);
    return (
        <TouchableOpacity activeOpacity={0.8}>
            <View style={styles.container}>
                <Image
                    resizeMode="cover"
                    /* Sizes are different for some covers so using resizeMode as 'cover' instead of 'contain' */
                    resizeMethod="resize"
                    source={{ uri: coverUri }}
                    style={styles.imageStyle}
                    PlaceholderContent={
                        <ActivityIndicator color={theme.colors.primary} />
                    }
                />
                {showInfoOverlay && (
                    <View style={styles.bookInfoContainer}>
                        <Text style={styles.text} numberOfLines={2}>
                            {book.title}
                        </Text>
                        {book.authors && book.authors.length ? (
                            <Text
                                style={[styles.text, styles.authorText]}
                                numberOfLines={1}>
                                {book.authors[0]}
                            </Text>
                        ) : null}
                        <Rating
                            fractions={1}
                            readonly
                            tintColor={theme.colors.black}
                            ratingColor="#f1c40f"
                            startingValue={averageRating || 0}
                            ratingTextColor={theme.colors.black}
                            imageSize={12}
                            ratingBackgroundColor={theme.colors.grey4}
                        />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

BookCard.propTypes = {
    book: PropTypes.object.isRequired,
    showInfoOverlay: PropTypes.bool,
};

BookCard.defaultProps = {
    showInfoOverlay: true,
};

const useStyles = makeStyles((theme, _) => ({
    container: {
        width: cardWidth,
        height: undefined,
        maxHeight: cardWidth * 1.7,
        justifyContent: 'flex-end',
        margin: moderateScale(4),
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        borderRadius: BORDER_RADIUS,
    },
    text: {
        fontWeight: '700',
        fontSize: scale(12),
        color: theme.colors.white,
        textAlign: 'center',
    },
    authorText: {
        fontWeight: '500',
        fontSize: scale(10),
        color: theme.colors.grey4,
    },
    bookInfoContainer: {
        position: 'absolute',
        width: '100%',
        backgroundColor: theme.colors.black,
        opacity: 0.8,
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 'auto',
        paddingTop: verticalScale(4),
        paddingBottom: verticalScale(4),
        paddingLeft: moderateScale(2),
        paddingRight: moderateScale(2),
        borderBottomEndRadius: BORDER_RADIUS,
        borderBottomStartRadius: BORDER_RADIUS,
    },
}));

export default memo(BookCard);
