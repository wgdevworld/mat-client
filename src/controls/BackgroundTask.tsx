// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const performYourBackgroundTask = async (taskId: string) => {
  try {
    // obtain background location
    // iterate through array and check distances. if distance is smaller than certain number, then add to list
    // send notification for list.
    const response = await fetch('https://your.api/endpoint');
    const data = await response.json();
    console.log('Data fetched', data);
  } catch (error) {
    console.error('Error performing background task', error);
  }
};
