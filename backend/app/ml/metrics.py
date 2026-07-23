import tensorflow as tf


def binary_accuracy(y_true, y_pred, threshold=0.5):
    y_true = tf.cast(y_true, tf.float32)
    y_pred_bin = tf.cast(y_pred >= threshold, tf.float32)

    correct = tf.cast(tf.equal(y_true, y_pred_bin), tf.float32)
    mask = tf.cast(tf.not_equal(y_true, -1.0), tf.float32)

    num_correct = tf.reduce_sum(correct * mask)
    denom = tf.reduce_sum(mask)

    return tf.math.divide_no_nan(num_correct, denom)
