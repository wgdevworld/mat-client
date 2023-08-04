import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import assets from '../../assets';
import StarRating from 'react-native-star-rating-widget';
import {
  View,
  Text,
  StyleSheet,
  // Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

// interface ReviewCardProps {
//   author: string;
//   rating: number;
//   content: string;
//   //   date: Date
//   //   images: Image[];
// }

// class ReviewForm extends Component {
//   ratingCompleted(rating: any) {
//     console.log(rating);
//   }

const ReviewForm = () => {
  // const images = [
  //   assets.images.스시올로지,
  //   assets.images.야키토리나루토,
  //   assets.images.월량관,
  // ];
  // render()
  const handlePressSumbit = () => {
    // add data to db and rerender
    console.log(comment);
    console.log(rating);
  };
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>리뷰 작성하기</Text>
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
        <View style={styles.icon}>
          <Ionicons name="text" size={15} color={'white'} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="리뷰를 작성해주세요!"
          placeholderTextColor="white"
          selectionColor="white"
          multiline
          onChangeText={text => setComment(text)}
        />
      </View>
      {/* add onPress to TouchableOpacity */}
      <TouchableOpacity style={styles.submitButton} onPress={handlePressSumbit}>
        <Text style={styles.submitText}>등록하기</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 15,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  cardHorizontal: {
    alignItems: 'center',
    flexDirection: 'row',
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
    marginBottom: 20,
    position: 'relative',
  },
  icon: {
    marginRight: 15,
  },
  input: {
    borderBottomWidth: 1.5,
    flex: 1,
    paddingBottom: 10,
    borderBottomColor: '#eee',
    fontSize: 16,
    color: 'white',
  },
  submitButton: {
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  submitText: {
    color: 'black',

    backgroundColor: 'white',
  },
});

export default ReviewForm;
