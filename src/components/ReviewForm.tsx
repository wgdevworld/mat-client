import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import {
  View,
  Text,
  StyleSheet,
  Image,
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

const ReviewForm = (
  {
    //   date,
    //   images,
  },
) => {
  const images = [
    assets.images.스시올로지,
    assets.images.야키토리나루토,
    assets.images.월량관,
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.text}>리뷰 작성하기</Text>
      {/* <Rate /> */}
      <View style={styles.inputContainer}>
        <View style={styles.icon}>
          <Ionicons name="text" size={15} color={'white'} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="리뷰를 작성해주세요!"
          placeholderTextColor="white"
          selectionColor="white"
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.icon}>
          <Ionicons name="star-outline" size={15} color={'white'} />
        </View>
        {/* <Rate allowHalf /> */}
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="white"
          selectionColor="white"
        />
      </View>
      {/* <TouchableOpacity style={styles.forgotIdButton}>
        <Text style={styles.forgotIdButtonText}>아이디 찾기</Text>
      </TouchableOpacity> */}
      {/* <View style={styles.forgotButtons}>
        <TouchableOpacity style={styles.forgotIdButton}>
          <Text style={styles.forgotIdButtonText}>아이디 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordButtonText}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>또는</Text>
        <View style={styles.orLine} />
      </View>
      <TouchableOpacity style={styles.setAccountButton}>
        <Text style={styles.setAccountButtonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={assets.images.kakao_login_medium_narrow} />
      </TouchableOpacity> */}
    </View>
    // <View style={styles.container}>
    //   <Text>{author}</Text>
    //   <Text>{rating}</Text>
    //   <Text>{content}</Text>
    //   {/* <Text>{date.toLocaleDateString('ko-KR')}</Text> */}
    //   {/* <ImageCarousel images={images} /> */}
    // </View>
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
  mapName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  mapAuthor: {
    fontSize: 12,
    marginBottom: 5,
    color: 'white',
  },
  followersCount: {
    color: 'white',
    marginBottom: 10,
  },
  lowerHalf: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  //   container: {
  //     flex: 1,
  //     backgroundColor: '#FF4000',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
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
  },
});

export default ReviewForm;
