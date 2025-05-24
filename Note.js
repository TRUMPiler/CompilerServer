const COLLECTION_NAME = 'Notes';
const noteModal = {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
    language: { type: String, required: true },
    date:{type:Date,required:true,default:Date.now()},
    isDeleted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    
    addNote: async function (db,note) {
        try {
            db = db.collection(COLLECTION_NAME);
            
            const result = await db.insertOne(note);
            console.log(result);
            return result;

        } catch (error) {
            console.error('Error adding note:', error);
            throw error;
        }
    },
    updateNote: async function (db,note,id) {
        try {
            db = db.collection(COLLECTION_NAME);
            const result = await db.updateOne({ _id:id }, { $set: note });
            return result;
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    },
    deleteNote: async function (db,id) {
        try {
            db = db.collection(COLLECTION_NAME);
            const result = await db.deleteOne({ _id:id });
            return result;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    },
    PinnedNote: async function (db,id) {
        try {
            db = db.collection(COLLECTION_NAME);
            const result = await db.updateOne({ _id: id }, { $set: { isPinned: true } });
            return result;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    },
    getNote: async function (db,id) {
        try {
            db = db.collection(COLLECTION_NAME);
            const result = await db.findOne({ _id: id });
            return result;
        } catch (error) {
            console.error('Error getting note:', error);
            throw error;
        }
    },
    getAllNotes: async function (db,userid) {
        try {
            db = db.collection(COLLECTION_NAME);
            const result = await db.find({ userId: userid }).toArray();
            return result;
        } catch (error) {
            console.error('Error getting all notes:', error);
            throw error;
        }
    }
};


module.exports = { noteModal, COLLECTION_NAME };