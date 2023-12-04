import {REQ_METHOD, request} from '../controls/RequestControl';
import {addressToCoordinate} from '../tools/CommonFunc';
import {Coordinate, MatMap, MatZip} from '../types/store';

export const matMapSerializer = async (matMaps: any[]) => {
  return Promise.all(
    matMaps.map(async (data: any) => {
      const imgSrcArr = data.images.map((img: any) => img.src);
      const serializedZipList: MatZip[] = await Promise.all(
        data.zipList.map(async (zip: any) => {
          const zipImgSrcArr = zip.images
            ? zip.images.map((img: any) => img.src)
            : [];
          const fetchReviewQuery = `{
              fetchReviewsByZipId(zipId: "${zip.id}") {
                writer {
                  name
                }
                rating
                content
                createdAt
                images {
                  id
                  src
                }
              }
            }`;
          const fetchedReviewRes = await request(
            fetchReviewQuery,
            REQ_METHOD.QUERY,
          );
          const fetchedReviewData =
            fetchedReviewRes?.data.data.fetchReviewsByZipId;
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
          let coordinate: Coordinate;
          try {
            coordinate = await addressToCoordinate(zip.address);
          } catch (error) {
            console.error(
              `Failed to get coordinates for address: ${zip.address}`,
              error,
            );
            coordinate = {latitude: 0, longitude: 0}; // Fallback
          }
          return {
            id: zip.id,
            name: zip.name,
            imageSrc: zipImgSrcArr,
            coordinate,
            address: zip.address,
            reviewCount: zip.reviewCount,
            reviewAvgRating: zip.reviewAvgRating,
            category: zip.category,
            reviews: filteredReviewList,
          } as MatZip;
        }),
      );

      console.log(data.creator);
      const serializedMatMap: MatMap = {
        id: data.id,
        name: data.name,
        description: data.description,
        publicStatus: data.publicStatus,
        areaCode: data.areaCode,
        zipList: serializedZipList,
        followerList: data.followerList,
        imageSrc: imgSrcArr,
        author: data.creator.name,
        authorId: data.creator.id,
        //TODO: add back in after backend fix of followList
        // numFollower: data.followerList.length,
      };
      return serializedMatMap;
    }),
  );
};
