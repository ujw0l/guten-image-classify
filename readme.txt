=== Image Classify ===
Contributors:      UjW0L
Tags:              block, deep learning, transfer learning, tensorflowjs, image classification, upload restriction
Tested up to:      6.6
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Block to classify images before uploading.

== Description ==

Image Classify is a WordPress plugin that provides a block to classify images using deep learning. The plugin allows administrators to control what kind of images users can upload, helping to block unwanted image uploads to the server.

The plugin uses a third-party deep learning model to perform image classification, without sending data outside of the user's device. The model is loaded locally, ensuring data privacy.

= Features =

* Image classification using TensorFlow.js with MobileNet V1.
* Set minimum confidence score thresholds for image classes.
* Control image uploads based on classification results.

= Integrations =

The plugin uses a third-party model from TensorFlow Hub, but no data is sent out of the user's device. The model used is:
* [MobileNet V1 Classification Model](https://tfhub.dev/google/imagenet/mobilenet_v1_025_224/classification/1)

== Installation ==

To install the Image Classify plugin:

1. Upload the plugin files to the `/wp-content/plugins/image-classify` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.

== Frequently Asked Questions ==

= What is the confidence score? =

The confidence score is the minimum threshold value that determines whether an image belongs to one of the specified classes. If an image's classification score is below this threshold, it will be blocked from uploading.

= Does this plugin send data to third-party services? =

No. The plugin loads a pre-trained model from TensorFlow Hub to classify images, but all processing happens locally on the user's device, and no data is sent to third-party servers.

== Screenshots ==

1. Block settings configuration screen for administrators.
2. User-facing side of the block to provide feedback about image classification.

== Changelog ==

= 0.1.0 =
* Initial release.

= 1.0.0 =
* Added nonce verification for improved security.

== Upgrade Notice ==

= 1.0.0 =
Added nonce verification for security. Please update to ensure your plugin is secure.