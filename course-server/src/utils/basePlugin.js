import slugify from "slugify"
import mongoose from 'mongoose'

function softDeletePlugin(schema) {
    schema.add({
        isDeleted: { type: Boolean, default: false, index: true },
        deletedAt: Date,
        deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    });

    schema.pre(/^find/, function (next) {
        if (!this.getQuery().includeDeleted) {
            this.where({ isDeleted: false });
        }
        next();
    });

    schema.methods.softDelete = function (userId) {
        this.isDeleted = true;
        this.deletedAt = new Date();
        this.deletedBy = userId;
        return this.save();
    };

    schema.methods.restore = function () {
        this.isDeleted = false;
        this.deletedAt = null;
        this.deletedBy = null;
        return this.save();
    };
}


function slugPlugin(schema, fieldName) {
    schema.add({
        slug: { type: String, unique: true, index: true },
    });

    schema.pre("save", async function (next) {
        if (this.isModified(fieldName)) {
            let baseSlug = slugify(this[fieldName], {
                lower: true,
                strict: true,
            });

            let slug = baseSlug;
            let counter = 1;

            while (await this.constructor.findOne({ slug })) {
                slug = `${baseSlug}-${counter++}`;
            }

            this.slug = slug;
        }
        next();
    });
}


export { softDeletePlugin, slugPlugin }