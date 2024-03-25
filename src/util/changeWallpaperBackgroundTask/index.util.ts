import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';
import { setAndroidWallpaper } from '../wallpaper.util';
import { getActiveFolderItemImageURL } from './firestore.util';


// This function is used to get the URL of the active folder and set the Android wallpaper
export async function setWallpaperFromActiveFolder() {
	// Get the active folder item image URL
	const folderItem = await getActiveFolderItemImageURL();

	// If the folder item exists, set the Android wallpaper to the folder item image
	const res = folderItem?.folderItem && await setAndroidWallpaper(folderItem?.folderItem?.image.secure_url);

	// Log the result of setting the wallpaper
	console.log("Wallpaper result: ", res)

	return res;
}

export async function getActiveFolderURLAndSetAndroidWallpaper(event: HeadlessEvent) {
	try {
		// Get the taskId and timeout from the event
		const taskId = event.taskId;
		const timeout = event.timeout;

		if (timeout) {
			// If the background-time has expired, finish the task immediately
			console.log('[BackgroundFetch] Headless TIMEOUT:', taskId);
			BackgroundFetch.finish(taskId);
			return;
		}

		// Log the start of the headless task
		console.log('[BackgroundFetch HeadlessTask] start: ', taskId);

		// Call the extracted function
		await setWallpaperFromActiveFolder();

		// Finish the task
		BackgroundFetch.finish(taskId);
	} catch (err) {
		// If an error occurs, log the error and finish the task
		console.error(err);
		BackgroundFetch.finish(event.taskId);
	}
}


// This function is used to compute the fetch interval based on the given interval
function computeFetchInterval(interval: 'daily' | 'weekly' | 'monthly'): number {
	switch (interval) {
		case 'daily':
			return 60 * 24; // 24 hours
		case 'weekly':
			return 60 * 24 * 7; // 7 days
		case 'monthly':
			return 60 * 24 * 30; // 30 days
		default:
			return 15; // Default to 15 minutes
	}
}

// This function is used to configure and schedule the background fetch
export async function configureAndScheduleBackgroundFetch(interval: 'daily' | 'weekly' | 'monthly') {
	const fetchInterval = computeFetchInterval(interval);

	// Configure the background fetch
	BackgroundFetch.configure({
		minimumFetchInterval: fetchInterval, // Fetch interval in minutes
		stopOnTerminate: false,   // Android only
		startOnBoot: true,        // Android only
		enableHeadless: true,     // Enable headless mode
	}, async (taskId) => {
		console.log("[BackgroundFetch] taskId", taskId);

		// Perform the task here
		await getActiveFolderURLAndSetAndroidWallpaper({ taskId, timeout: false });

		// Finish the task
		BackgroundFetch.finish(taskId);
	}, async (taskId) => {
		console.log("[BackgroundFetch] TIMEOUT taskId", taskId);

		// Perform the task here
		await getActiveFolderURLAndSetAndroidWallpaper({ taskId, timeout: true });

		// Finish the task
		BackgroundFetch.finish(taskId);
	});

	// Start the background fetch
	BackgroundFetch.start();

	// Check the status of the background fetch
	const status = await BackgroundFetch.status();

	switch (status) {
		case BackgroundFetch.STATUS_RESTRICTED:
			console.log("BackgroundFetch restricted");
			break;
		case BackgroundFetch.STATUS_DENIED:
			console.log("BackgroundFetch denied");
			break;
		case BackgroundFetch.STATUS_AVAILABLE:
			console.log("BackgroundFetch is enabled");
			break;
	}
}


