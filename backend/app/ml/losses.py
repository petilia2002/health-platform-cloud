import tensorflow as tf

EPS = tf.keras.backend.epsilon()


def binary_crossentropy(y_true, y_pred):
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.clip_by_value(y_pred, EPS, 1.0 - EPS)

    bce_elem = -(
        y_true * tf.math.log(y_pred) + (1.0 - y_true) * tf.math.log(1.0 - y_pred)
    )

    mask = tf.cast(tf.not_equal(y_true, -1.0), tf.float32)

    total_loss = tf.reduce_sum(bce_elem * mask)
    denom = tf.reduce_sum(mask)

    return tf.math.divide_no_nan(total_loss, denom)
