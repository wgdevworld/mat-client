/* eslint-disable react-native/no-inline-styles */
import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
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
  Image,
  FlatList,
} from 'react-native';
import {REQ_METHOD, request} from '../controls/RequestControl';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Review} from '../types/store';
import {useDispatch} from 'react-redux';
import {addReviewAction} from '../store/modules/userMaps';
import {v4 as uuidv4} from 'uuid';

const ReviewForm: React.FC<{
  zipId?: string;
  setReviews: Dispatch<SetStateAction<Review[] | undefined>>;
}> = ({zipId, setReviews}) => {
  const dispatch = useDispatch();
  const reviewInputRef = useRef<TextInput>(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [imgLibraryResponse, setImgLibraryResponse] =
    useState<ImagePickerResponse>();

  const onPressChoosePhoto = async () => {
    const options: ImageLibraryOptions = {
      maxWidth: 1280,
      maxHeight: 1280,
      mediaType: 'photo',
      selectionLimit: 0,
    };
    await launchImageLibrary(options, response => {
      if (!response.assets) {
        console.log(response.errorMessage);
      } else {
        setImgLibraryResponse(response);
      }
    });
  };

  const uploadImageToServer = async (response?: ImagePickerResponse) => {
    if (response?.assets?.length === 0) {
      return;
    }

    let formData = new FormData();

    const map: {[key: string]: string[]} = {};
    response?.assets?.forEach((asset, index) => {
      map[String(index)] = [`variables.files.${index}`];
    });

    formData.append(
      'operations',
      JSON.stringify({
        query: `
            mutation ($files: [Upload!]!) {
                upload(files: $files)
            }
        `,
        variables: {
          files: response?.assets?.map((_, _index) => null),
        },
      }),
    );

    formData.append('map', JSON.stringify(map));

    response?.assets?.forEach((asset, index) => {
      formData.append(String(index), {
        uri: asset.uri,
        type: 'image/jpeg',
        name: `${uuidv4()}.jpeg`,
      });
    });

    const res = await request('', REQ_METHOD.MUTATION, formData);
    return res?.data.data.upload;
  };

  const handlePressSubmit = async () => {
    try {
      let reviewPhotos;
      if (imgLibraryResponse) {
        const imgSrcString = await uploadImageToServer(imgLibraryResponse);
        const uploadImageString = imgSrcString.map(
          (item: string) => 'https://storage.googleapis.com/' + item,
        );
        reviewPhotos = {
          imageSrc: uploadImageString,
        };
        setImgLibraryResponse(undefined);
      }

      const variables = {
        reviewInput: {
          rating: rating,
          content: content,
          ...(reviewPhotos ? reviewPhotos : {}),
        },
        matZipId: zipId,
      };
      const query = `
      mutation createReview($reviewInput: CreateReviewInput! $matZipId: String!) {
        createReview(reviewInput: $reviewInput matZipId: $matZipId) {
          rating
          content
        }
      }`;

      await request(query, REQ_METHOD.MUTATION, variables);
      const fetchReviewQuery = `{
        fetchReviewsByZipId(zipId: "${zipId}") {
          writer {
            name
          }
          rating
          content
          createdAt
          images {
            parentReview {
              id
            }
            src
          }
        }
      }`;
      const fetchedReviewRes = await request(
        fetchReviewQuery,
        REQ_METHOD.QUERY,
      );
      const fetchedReviewData = fetchedReviewRes?.data.data.fetchReviewsByZipId;
      const filteredReviewList = fetchedReviewData.map((review: any) => {
        const reviewImages = review.images.map((image: any) => {
          return {
            id: image.id,
            src: image.src,
          };
        });
        return {
          author: review.writer.name,
          rating: review.rating,
          content: review.content,
          date: new Date(review.createdAt),
          images: reviewImages,
        };
      });

      console.log(filteredReviewList);
      setReviews(filteredReviewList);
      dispatch(addReviewAction({zipId: zipId, review: filteredReviewList}));
      reviewInputRef.current?.clear();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {imgLibraryResponse && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FlatList
            data={imgLibraryResponse?.assets}
            horizontal={true}
            contentContainerStyle={{paddingBottom: 10}}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            bounces={false}
            renderItem={item => {
              return (
                <View
                  style={{
                    marginRight: 12.5,
                    paddingTop: 5,
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}>
                  <Image
                    source={{uri: item.item.uri}}
                    style={{width: '100%', height: '100%'}}
                    borderRadius={10}
                  />
                </View>
              );
            }}
            ListFooterComponent={
              <TouchableOpacity onPress={onPressChoosePhoto}>
                <Ionicons
                  name="create-outline"
                  size={30}
                  color={colors.coral1}
                />
              </TouchableOpacity>
            }
            ListFooterComponentStyle={{alignSelf: 'center'}}
          />
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <StarRating
          rating={rating}
          onChange={setRating}
          enableHalfStar={false}
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
        {(imgLibraryResponse?.assets?.length === 0 || !imgLibraryResponse) && (
          <TouchableOpacity onPress={onPressChoosePhoto}>
            <Text style={styles.choosePhotoText}>사진 고르기</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        {/* <View style={styles.icon}>
          <Ionicons name="text" size={15} color={'black'} />
        </View> */}
        <TextInput
          ref={reviewInputRef}
          style={styles.input}
          placeholder="리뷰를 작성해주세요!"
          placeholderTextColor="darkgrey"
          selectionColor="black"
          multiline
          onChangeText={text => setContent(text)}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handlePressSubmit}>
          <Text style={styles.submitText}>등록</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: colors.grey,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    padding: 15,
    paddingTop: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 5,
  },
  choosePhotoText: {
    fontSize: 12,
    color: colors.coral1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    position: 'relative',
    marginTop: 0,
  },
  icon: {
    marginRight: 15,
    marginTop: 10,
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
    marginLeft: -13,
  },
  submitButton: {
    marginBottom: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 3,
    backgroundColor: colors.grey,
    marginRight: -23,
    marginLeft: 9,
  },
  submitText: {
    color: colors.coral1,
  },
});

export default ReviewForm;
