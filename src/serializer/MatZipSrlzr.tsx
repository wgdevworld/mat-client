import {request, REQ_METHOD} from '../controls/RequestControl';
import {addressToCoordinate} from '../tools/CommonFunc';
import {Coordinate, MatZip} from '../types/store';

export const matZipSerializer = async (matZips: any[]) => {
  return Promise.all(
    matZips.map(async zip => {
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
        place_id: zip.number ? zip.number : null,
      } as MatZip;
    }),
  );
};
