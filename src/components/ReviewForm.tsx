import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import assets from '../../assets';
import StarRating from 'react-native-star-rating-widget';
import colors from '../styles/colors';
import {
  View,
  Text,
  StyleSheet,
  // Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

// interface ReviewCardProps {
//   author: string;
//   rating: number;
//   content: string;
//   //   date: Date
//   //   images: Image[];
// }

const ReviewForm = () => {
  // const images = [
  //   assets.images.스시올로지,
  //   assets.images.야키토리나루토,
  //   assets.images.월량관,
  // ];
  // render()
  // const handlePressSumbit = () => {
  //   // add data to db and rerender
  //   console.log(comment);
  //   console.log(rating);
  // };
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const handlePressSubmit = async () => {
    try {
      const reviewInput = {
        rating: rating,
        content: content,
      };
      console.log(reviewInput);
      const query = `
      mutation {
        createReview(matZipId: "0923", reviewInput: {
          rating: $rating,
          content: $content
        }) {
          id
          rating
          createdAt
        }
      }
        `;

      axios
        .post(
          'https://muckit-server.site/graphql',
          {
            query,
            reviewInput,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )
        .then((result: {data: any}) => {
          console.log(result.data);
        })
        .catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.icon}>
        <Ionicons name="star-outline" size={15} color={'white'} />
      </View> */}
      <StarRating
        rating={rating}
        onChange={setRating}
        enableHalfStar
        enableSwiping
        maxStars={5}
        starSize={20}
        color={colors.coral1}
        //minRating
      />
      {/* <Rating
        imageSize={20}
        ratingCount={5}
        style={{paddingVertical: 10}}
        tintColor="blue"
        fractions={1}
        jumpValue={0.5}
        startingValue={0}
        minValue={1}
        onFinishRating={this.rating => setRating(rating)}
      /> */}
      <View style={styles.inputContainer}>
        {/* <View style={styles.icon}>
          <Ionicons name="text" size={15} color={'black'} />
        </View> */}
        <TextInput
          style={styles.input}
          placeholder="리뷰를 작성해주세요!"
          placeholderTextColor="darkgrey"
          selectionColor="black"
          multiline
          onChangeText={text => setContent(text)}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handlePressSubmit}>
        <Text style={styles.submitText}>작성</Text>
      </TouchableOpacity>
      </View>
      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: colors.grey,
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    padding: 15
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 5,
  },
  inputContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
    marginTop: 15
  },
  icon: {
    marginRight: 15,
    marginTop: 10
  },
  input: {
    borderBottomWidth: 1,
    flex: 1,
    marginTop: 5,
    paddingBottom: 5,
    paddingTop: 1,
    borderBottomColor: 'darkgrey',
    fontSize: 16,
    color: 'black',
    marginLeft: -13
  },
  submitButton: {
    marginBottom: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: -23,
    marginLeft: 9
  },
  submitText: {
    color: 'black',
    backgroundColor: 'white',
  },
});

export default ReviewForm;
