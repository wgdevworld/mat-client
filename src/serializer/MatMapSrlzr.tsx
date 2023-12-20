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
          let coordinate: Coordinate;
          if (zip.latitude === null || zip.longitude === null) {
            try {
              // fallback for when database doesn't have coordinates stored
              console.log('⛔️ Using Geocoder to retrieve coordinates');
              coordinate = await addressToCoordinate(zip.address);
              const updateZipQuery = `
              mutation updateZip($id: String!, $zipInfo: UpdateZipInput!) {
                  updateZip(id: $id, zipInfo: $zipInfo) {
                    id
                    latitude
                    longitude
                  }
              }
             `;
              const updateZipVariables = {
                id: zip.id,
                zipInfo: {
                  latitude: coordinate.latitude,
                  longitude: coordinate.longitude,
                },
              };
              await request(
                updateZipQuery,
                REQ_METHOD.MUTATION,
                updateZipVariables,
              );
            } catch (error) {
              console.error(
                `Geocoder failed to get coordinates for address: ${zip.address}`,
                error,
              );
              coordinate = {latitude: 0, longitude: 0}; // Fallback
            }
          } else {
            coordinate = {
              latitude: zip.latitude,
              longitude: zip.longitude,
            };
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
          } as MatZip;
        }),
      );

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
