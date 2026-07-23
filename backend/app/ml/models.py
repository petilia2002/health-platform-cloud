import numpy as np
from keras import Model, Input
from keras.layers import (
    Dense,
    Dropout,
    Embedding,
    Flatten,
    MultiHeadAttention,
    TimeDistributed,
)
from keras.optimizers import Adam

from app.ml.layers import RealValueLayer, MaskLayerLeft, MaskLayerRight
from app.ml.losses import binary_crossentropy
from app.ml.metrics import binary_accuracy


def create_mlp(n_features: int):
    inputs = Input(name="input_1", shape=(n_features,))
    layer = Dense(name="dense_1", units=90, activation="relu")(inputs)
    layer = Dropout(name="dropout_1", rate=0.2)(layer)
    layer = Dense(name="dense_2", units=30, activation="relu")(layer)
    layer = Dropout(name="dropout_2", rate=0.1)(layer)
    outputs = Dense(name="dense_3", units=4, activation="sigmoid")(layer)
    model = Model(inputs=inputs, outputs=outputs)

    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss=binary_crossentropy,
        metrics=[binary_accuracy],
    )
    return model


# Basic ULM Model
def create_ulm(embeddings_file, N_train, N_pred):

    gpt = np.load(embeddings_file)
    dims = gpt.shape
    emb_size = dims[1]

    # First create an embedding network, this model is not supposed to be trainable.
    l_yandex = Input(name="input_analytes", shape=(None,))
    l_embed = Embedding(name="embedding", input_dim=dims[0], output_dim=dims[1])(
        l_yandex
    )

    embed = Model(l_yandex, l_embed, name="gpt")
    embed.set_weights([gpt])
    embed.trainable = False

    # Main network code
    l_in = Input(name="values", shape=(N_train,))
    l_words = Input(name="analytes", shape=(N_train,))
    l_mask = Input(name="mask", shape=(N_train,))

    l_pred = Input(name="outcomes", shape=(N_pred,))

    l_emb = embed(l_words)
    l_tests = embed(l_pred)
    embed.trainable = False

    l_m1 = MaskLayerLeft()(l_mask)
    l_m2 = MaskLayerRight()([l_pred, l_mask])

    l_v = RealValueLayer(embedding_size=emb_size, name="real_value_embedding")(
        [l_emb, l_in]
    )

    # Add trainable bias to the input values.
    l_pos = Embedding(name="yandex_bias", input_dim=dims[0], output_dim=emb_size)(
        l_words
    )
    l_v = l_v + l_pos

    # Add trainable bias to the ouytput values.
    l_p = Embedding(name="yandex_bias_pred", input_dim=dims[0], output_dim=emb_size)(
        l_pred
    )
    l_tests = l_tests + l_p

    l_enc = MultiHeadAttention(num_heads=8, key_dim=16, dropout=0.1)(
        query=l_v, value=l_v, key=l_v, attention_mask=l_m1
    )
    l_dec = MultiHeadAttention(num_heads=8, key_dim=16, dropout=0.1)(
        query=l_tests, value=l_enc, key=l_enc, attention_mask=l_m2
    )

    l_o = TimeDistributed(Dense(units=16, activation="relu"))(l_dec)
    l_f = Flatten()(l_o)

    l_out_cbc = Dense(units=N_pred, activation="sigmoid")(l_f)

    model = Model([l_in, l_words, l_mask, l_pred], l_out_cbc)

    model.compile(
        optimizer=Adam(learning_rate=1e-3),
        loss=binary_crossentropy,
        metrics=[binary_accuracy],
    )

    return model
