import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';
import { setAndroidWallpaper } from '../wallpaper.util';
import { getActiveFolderItemImageURL, updateFolderAndActiveFolder, updateUserActiveFolderItemIdx } from './firestore.util';
import { CollectionOptionTypes, FolderProps } from '@components/Home/type';
import { ActiveFolderProps, useAuthStore } from 'store/authStore';
import { Platform } from 'react-native';
import colors from 'colors';
import { errorToast, neutralToast } from '../toast.util';


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


/**
 * This function sets the Android wallpaper to the image of the active item in the user's active folder. 
 * It retrieves the image URL of the active folder item and, if the item exists, sets the Android wallpaper to this image.
 */
export async function setWallpaperFromActiveFolder() {
	// Get the active folder item image URL
	const folderItem = await getActiveFolderItemImageURL();

	if (!folderItem) {
		// If the folder item does not exist, notify the user and return null
		errorToast('No active folder item found');
		return null;
	}

	// If the folder item exists, set the Android wallpaper to the folder item image
	const res = folderItem?.folderItem && await setAndroidWallpaper(folderItem?.folderItem?.image.secure_url);

	return folderItem;
}

/**
 * This function retrieves the URL of the active folder and sets it as the Android wallpaper. 
 * It is designed to run as a background task, and handles task timeouts and errors.
 */
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
		const folder = await setWallpaperFromActiveFolder();

		if (folder && folder.folderId) {
			// If the folder has an ID, update the folder and the active folder
			folder.folderCategory === "personal" && updateFolderAndActiveFolder(1, folder?.folderId);

			folder.folderCategory === "community" && updateUserActiveFolderItemIdx(folder?.folderId, 1);
		}


		// Finish the task
		BackgroundFetch.finish(taskId);
	} catch (err) {
		// If an error occurs, log the error and finish the task
		console.error(err);
		BackgroundFetch.finish(event.taskId);
	}
}


/**
 * This function configures and schedules a background fetch task to update the Android wallpaper. 
 * The fetch interval can be set to daily, weekly, or monthly. 
 * The function configures the background fetch with the specified interval and settings, 
 * then defines the tasks to be performed when the fetch is executed or times out. 
 * After configuration, it starts the background fetch and checks its status.
 */
export async function configureAndScheduleBackgroundFetch(interval: 'daily' | 'weekly' | 'monthly') {
	if (Platform.OS !== 'android') {
		console.log("Background fetch is only available on Android");
		return
	}
	const fetchInterval = computeFetchInterval(interval);

	// Configure the background fetch
	BackgroundFetch.configure({
		minimumFetchInterval: 15, // Fetch interval in minutes
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

/**
 * This function stops all running background fetch tasks.
 */
export async function stopBackgroundFetch() {
	try {
		await BackgroundFetch.stop();
	} catch (error) {
		console.error("Failed to stop BackgroundFetch", error);
	}
}


/**
 * This function handles the update of the Android wallpaper based on the active folder.
 * It checks if the provided folder is the active one and if the platform is Android.
 * If these conditions are met, it updates the wallpaper and notifies the user.
 * If the folder is not active, it prompts the user to make it active.
 * Any errors during the process are caught and logged, and the user is notified.
 */
export async function handleAndroidWallpaperActive(isActive: boolean, folderId?: string, updateIdx: boolean = true, category: CollectionOptionTypes = 'personal') {

	try {
		if (!isActive) {
			neutralToast('Please make a folder active', colors.primary[300])
			return
		}
		// Check if the provided folder is the active one

		// If the platform is Android and the folder is active
		if (Platform.OS === 'android' && isActive) {
			const userId = useAuthStore.getState().user?.uid;

			// Notify the user that the wallpaper is being updated
			neutralToast('Updating wallpaper')

			// Update the wallpaper
			await setWallpaperFromActiveFolder();

			// If the folder has an ID and a user ID and updateIdx is true, update the folder and the active folder
			if (folderId && userId && updateIdx) {
				category === 'personal' && await updateFolderAndActiveFolder(1, folderId);
				category === 'community' && await updateUserActiveFolderItemIdx(userId, 1)
			}

			// Notify the user that the wallpaper has been changed
			neutralToast('Wallpaper Set Successfully')
		} else if (Platform.OS === 'android' && !isActive) {
			// If the folder is not active, prompt the user to make it active
			neutralToast('Please make the folder active')
		}
	} catch (error) {
		// If an error occurs, log it and notify the user
		console.error(error);
		errorToast('An error occurred. Please try again later.');
	}
}


