import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import {
  Badge,
  Button,
  Checkbox,
  FileInput,
  Label,
  Radio,
  RangeSlider,
  Select,
  Textarea,
  TextInput,
  ToggleSwitch,
} from 'flowbite-react';
import {
  ChefHat,
  CircleDollarSign,
  CloudCog,
  DollarSign,
  Plus,
  PlusCircle,
  RefreshCcw,
  Save,
  Send,
  UploadCloudIcon,
  Utensils,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import Switch from 'react-switch';
import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/config/firebase.config.js';
import { useDispatch } from 'react-redux';
import { addNewProduct, getAllProducts } from '@/api/index.js';

const categories = [
  'Burgers',
  'Pizza',
  'Pasta',
  'Sushi',
  'Steak',
  'Tacos',
  'Burritos',
  'Breakfast',
  'Seafood',
  'Fast Food',
  // 'Italian',
  // 'Japanese',
  // 'American',
  // 'Mexican',
  'Dessert',
  'Salad',
  'Beverage',
  'Sandwich',
  'Appetizer',
  // 'Chinese',
  'Soup',
  'Salad',
  'Sandwich',
  'Wrap',
  'Cheese',
  'Cocoa',
  'Condiment',
  'Oil',
  'Fat',
  'Egg',
  'Fermented',
  'Flour',
  'Grain',
  'Herb',
  'Spice',
  'Legume',
  'Mushroom',
  'Nut',
  'Seed',
  'Processed',
  'Ultra-processed',

  // 'Indian',
  // 'Thai',
  // 'Vietnamese',
  // 'Korean',
  // 'French',
  // 'Mediterranean',
  // 'Middle Eastern',
  // 'Moroccan',
  // 'Spanish',
  // 'Turkish',
  // 'Ethiopian',
  // 'Brazilian',
  // 'Caribbean',
  // 'Cajun',
  // 'Soul Food',
  // 'BBQ',
  // 'Vegan',
  // 'Vegetarian',
  // 'Gluten-Free',
  // 'Paleo',
  // 'Keto',
  // 'Halal',
  // 'Kosher',
];

// TODO: Make this consistent 

// TODO: Fix image upload not allowing submit if another file type is uploaded
export const DashboardAddProducts = () => {
  // TODO: The upload should not start immediately after selecting the file, but its set like this for now for testing purposes


  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [firebaseImageUrl, setFirebaseImageUrl] = useState('');

  const [filePath, setFilePath] = useState(null);


  // For firebase storage upload
  // Set the file object when you upload the image
  const uploadImageToFirebase = (file) => {
    // TODO: Add the react hook form error here
    if (!file.type.startsWith("image/")) {
      toast.error("File is not an image.");
      console.error("Error: File is not an image.");
      return;
    }
    setIsLoading(true);
    // Construct the file path using the timestamp and the file name
    const filePath = `productImages/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Wrap the uploadTask.on method in a toast.promise function
    toast.promise(
      new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            // TODO: Add the react hook form error here
            console.log("Error uploading image:", error);
            console.error("Error uploading image:", error);
            reject(error); // Reject the promise with the error
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFirebaseImageUrl(downloadURL);
              setIsLoading(false);
              resolve(downloadURL);
              // Set the file path in the state
              setFilePath(filePath);
            });
          }
        );
      }),
      {
        loading: `Uploading image...`,
        success: <b>Image uploaded successfully</b>,
        error: <b>Could not upload image</b>,
      }
    );
  };



  // TODO: Add button to delete from firebase
  // TODO: Nutritional info is not being submitted to the database, the array object is empty, and the first index is onlly shown which is the unfinied values

  const deleteImageFromFirebase = async (filePath) => {
    try {
      if (!filePath) {
        toast('File Path is Missing!', {
          icon: '🚨',
        });
      }

      setIsLoading(true);
      const deleteRef = ref(storage, filePath);
      await getDownloadURL(deleteRef);
      await deleteObject(deleteRef);

      setFirebaseImageUrl(null);
      setIsLoading(false);
      toast.success("Image deleted successfully");
    } catch (error) {
      setIsLoading(false);
      if (error.code === "storage/object-not-found") {
        console.log("Image not found or already deleted.");
      } else {
        toast.error("Error deleting image. Please try again.");
        console.error("Error deleting image:", error);
      }
    }
  };




  const { control, handleSubmit, register, setValue, setError, getValues, watch, reset, formState: { errors },
  } = useForm({

    defaultValues: {
      ingredients: [{ value: '' }],
      sizes: [
        { name: 'small', price: '' },
        { name: 'regular', price: '' },
        { name: 'large', price: '' },
      ],
      noAddons: false,
      addons: [{ addonName: '', addonPrice: '' }],
      nutritionalInfo: [{
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: '',
        fiber: '',
        sugar: '',
      }],
      // TODO: Add other fields
    }
  });
  // TODO: Update the mockData and these data will be fetched from there instead, testing for now
  // TODO: Add checkbox for allergens
  // Add form validation
  const { register: registerAllergens, setValue: setAllergensValue } = useForm();
  const allergensOptions = ['Milk', 'Eggs', 'Fish', 'Crustaceans', 'Tree Nuts', 'Peanuts', 'Wheat', 'Soy'];


  const nutritionalInfoFields = ['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar'];

  const { register: registerDietaryInfo, setValue: setDietaryInfoValue } = useForm();
  const dietaryInfoOptions = [
    'Gluten-Free', 'Dairy-Free', 'Vegan', 'Vegetarian', 'Paleo', 'Keto', 'Low-Carb', 'Low-Fat', 'Low-Sodium', 'Sugar-Free'];

  // You can add more options if needed

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control,
    name: 'sizes',
  });

  const { fields: addonFields, append: appendAddon, remove: removeAddon } = useFieldArray({
    control,
    name: 'addons',
  });

  // const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
  //   control,
  //   name: 'images',
  // });

  // TODO: There must be at least one value for ingredients, addon, ingredients

  const handleRemoveSize = (index) => {
    const isChecked = watch(`sizes.${index}.checked`);

    if (isChecked) {
      setValue(`sizes.${index}.customSizeName`, '');
      setValue(`sizes.${index}.customSizePrice`, '');
    }

    if (sizeFields.length > 1) {
      removeSize(index);
    };
  }

  const handleAddAddon = () => {
    appendAddon({ addonName: '', addonPrice: '' });
  };

  const handleAddIngredient = () => {
    appendIngredient({ value: '' });

  };


  const handleAddCustomSize = () => {
    appendSize({ name: 'custom', price: '', checked: true })
  };

  const handleRemoveImage = (index) => {
    // Remove from imageFields using remove function
    removeImage(index);

    // Remove from selectedImageFiles
    const updatedImageFiles = [...selectedImageFiles];
    updatedImageFiles.splice(index, 1);
    setSelectedImageFiles(updatedImageFiles);

    // Remove from selectedImageUrls
    const updatedImageUrls = [...selectedImageUrls];
    updatedImageUrls.splice(index, 1);
    setSelectedImageUrls(updatedImageUrls);
  };


  const handleRemoveAddon = (index) => {
    if (addonFields.length > 1) {
      removeAddon(index);
    }
  };

  const handleRemoveIngredients = (index) => {
    if (ingredientFields.length > 1) {
      removeIngredient(index);
    }
  };

  const [selectedImageFiles, setSelectedImageFiles] = useState([]);
  const [selectedImageUrls, setSelectedImageUrls] = useState([]);

  // FIXME: Image array is not cleared when clearing form
  const handleClearForm = () => {
    reset({
      productName: '',
      category: '',
      basePrice: '',
      ingredients: [{ value: '' }],
      sizes: [
        { name: 'small', price: '' },
        { name: 'regular', price: '' },
        { name: 'large', price: '' },
      ],
      customSizeName: '',
      customSizePrice: '',
      noAddons: false,
      addons: [{ addonName: '', addonPrice: '' }],
      isPublished: false,
      isFeatured: false,
      images: [],
      imageURL: '',
      preparationTime: '',
      nutritionalInfo: [{
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: '',
        fiber: '',
        sugar: '',
      }],
      allergens: {
        Milk: false,
        Eggs: false,
        Fish: false,
        Crustaceans: false,
        'Tree Nuts': false,
        Peanuts: false,
        Wheat: false,
        Soy: false,
      },
      dietaryInformation: {
        'Gluten-Free': false,
        'Dairy-Free': false,
        Vegan: false,
        Vegetarian: false,
        Paleo: false,
        Keto: false,
        'Low-Carb': false,
        'Low-Fat': false,
        'Low-Sodium': false,
        'Sugar-Free': false,
      },

      // selectedImages: [],

      // TODO: Add other fields if needed
    });
  };


  const isPublished = useWatch({ control, name: 'isPublished', defaultValue: false });
  const isFeatured = useWatch({ control, name: 'isFeatured', defaultValue: false });

  // Updated onDrop function
  const onDrop = useCallback((acceptedFiles) => {
    // Filter out non-image files
    const newImages = acceptedFiles.filter((file) => file.type.startsWith('image/'));

    if (newImages.length !== acceptedFiles.length) {
      setError('images', {
        type: 'manual',
        message: 'Only one image is allowed.',
      });
    } else {
      setValue('images', newImages);
      setSelectedImageFiles(newImages);
    }
  }, [setValue, setError]);

  // TODO: When the user uploads an image and replaces it the replaced image is still stored in the database even when i delete the most recent image
  // Declare a state variable to store the file path

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png,",
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        // Check if there is an existing file path in the state
        if (filePath) {
          deleteImageFromFirebase(filePath);
        }
        uploadImageToFirebase(acceptedFiles[0]);
      }
    },
    // maxImageSize: maxImageSize,

  });


  useEffect(() => {
    console.log('handleImageChange: selectedImageFiles:', selectedImageFiles);
  }, [selectedImageFiles]);


  const [searchCategories, setSearchCategories] = useState('');
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchCategories.toLowerCase())
  );

  const onSubmit = (data) => {
    // Extracting data from the form
    const isAtLeastOneSizeSelected = data.sizes.some(size => size.checked);

    const nutritionalInfo = [{
      calories: data.nutritionalInfo.calories,
      protein: data.nutritionalInfo.protein,
      carbohydrates: data.nutritionalInfo.carbohydrates,
      fat: data.nutritionalInfo.fat,
      fiber: data.nutritionalInfo.fiber,
      sugar: data.nutritionalInfo.sugar,
    }];


    const {
      productName,
      category,
      basePrice,
      ingredients,
      sizes,
      noAddons,
      addons,
      isPublished,
      isFeatured,
      imageURL,
      preparationTime,

      allergens,
      dietaryInformation,
    } = data;

    // Removed these for now these are not submitted to the database
    const selectedAllergens = allergensOptions.filter(
      (allergen) => data.allergens && data.allergens[allergen]
    );


    const selectedDietaryInformation = dietaryInfoOptions.filter(
      (info) => data[`dietaryInformation.${info}`]
    );

    if (!isAtLeastOneSizeSelected) {
      alert("Select at least one size")
      return;
    }
    console.log('Nutritional Info:', nutritionalInfo);



    const product = {
      // restaurantId: 1, // Assign the restaurant ID
      imageURL: firebaseImageUrl,
      productName,
      category,
      basePrice,
      ingredients: ingredients.map((ingredient) => ingredient.value),
      // allergens: selectedAllergens,
      sizes: sizes
        .filter((size) => size.checked)
        .map((size) => ({
          name: size.name === 'custom' ? size.customSizeName : size.name,
          price: size.name === 'custom' ? size.customSizePrice : size.price,
        })),
      addons: noAddons ? [] : addons.map((addon) => ({ name: addon.addonName, price: addon.addonPrice })),
      nutritionalInfo,
      // dietaryInformation: selectedDietaryInformation,
      preparationTime,
      productDescription: data.productDescription,
      isPublished: isPublished || false,
      isFeatured: isFeatured || false,
    };

    console.log('Created Product:', product);
    addNewProduct(product).then((res) => {
      console.log(res)
      toast.success("Product added successfully");
      // TODO: ADD THIS BACK LATER AFTER TESTING
      // handleClearForm();
    }).catch((err) => {
      toast.error("Error adding product");
      console.log(err)
    }
    )
    getAllProducts().then((data) => {
      // FIXME: This is not working yet 
      // dispatch(getAllProducts(data));
      console.log(data)
    }
    )
  };

  return (
    <form
      className="max-w-3xl mx-auto bg-blue-100 border-4 shadow-md sm:rounded-lg p-8 overflow-x-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        <div className="">
          {/* Product Name */}
          <div className="mb-4">
            <div className="block mb-2">
              <Label htmlFor="productName" className="text-sm">
                Product Name
              </Label>
              <span className="ml-0.5 text-red-600 font-semibold text-md">*</span>
            </div>
            <input
              id="productName"
              placeholder="Product Name"
              {...register('productName', { required: true })}
              className={`w-full p-2 rounded-md ${errors.productName ? 'border-red-500 border-2 rounded-lg' : ''
                } `}
            />
            {errors.productName && (
              <span className="text-red-600 text-sm font-semibold">
                This is a required field
              </span>
            )}
          </div>

          {/* Select Category */}
          <div className="mb-4">
            <div className="block mb-2">
              <Label htmlFor="category" className="text-sm">
                Select your category
              </Label>
              <span className="ml-0.5 text-red-600 font-semibold text-md">*</span>
            </div>
            <select
              {...register('category', { required: true })}
              className={`w-full p-2 border rounded-md ${errors.category ? 'border-red-500 border-2 rounded-lg' : ''
                } `}
            >
              <option disabled value="">
                Select food category
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-600 text-sm font-semibold">
                Please select a category
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="block mb-2">
              <Label htmlFor="basePrice" value="Base Price" />
              <span className="ml-0.5 text-red-600 font-semibold text-md">*</span>
            </div>
            <input
              id="basePrice"
              type="text"
              placeholder="Price"
              {...register('basePrice', { required: true, pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
              className={`w-full rounded-md ${errors.basePrice ? 'border-red-500 border-2 rounded-lg' : ''
                } `}
            />
            {errors.basePrice && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.basePrice.type === 'required'
                  ? 'This is a required field'
                  : 'Invalid Decimal Number'}
              </span>
            )}
          </div>

          {/* Ingredients */}
          <div className="mb-4">
            <Label htmlFor="ingredients" className="text-md">
              Ingredients
            </Label>
            <span className="ml-0.5 text-red-600 font-semibold text-md">*</span>

            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex items-center justify-center text-sm py-2">
                <input
                  type="text"
                  id={`ingredients.${index}.value`}
                  name={`ingredients.${index}.value`}
                  placeholder="List of ingredients"
                  {...register(`ingredients.${index}.value`, { required: true })}
                  defaultValue={field.value || ''}
                  className={`w-full py-2 ${errors?.ingredients?.[index]?.value
                    ? 'border-red-500 border-2 rounded-lg'
                    : ''
                    } rounded-md`}
                />
                <span className="ml-2 cursor-pointer" onClick={() => handleRemoveIngredients(index)}>
                  <X className="w-4 h-4 rounded-full border text-red-500 hover:bg-red-600 hover:text-white shadow hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300" />
                </span>
              </div>
            ))}

            {Object.keys(errors.ingredients ?? {}).map((key, index) => (
              <p key={index} className="text-sm font-semibold text-red-600 mt-2">
                {errors.ingredients[key]?.value?.message || ''}
              </p>
            ))}

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleAddIngredient}
                className="sm:w-auto flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                <span>Add Ingredient</span>
              </button>
            </div>
          </div>

          {/* Sizes */}
          <div className='flex flex-col'>
            <Label htmlFor="sizes" className="text-md">
              Sizes
            </Label>
            <span className='text-sm text-red-600'>Note: This is applied on top of the base price</span>
            {sizeFields.map((size, index) => (
              <div key={size.id}>
                <div className="flex flex-col space-y-2 mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register(`sizes.${index}.checked`)}
                      className="mr-2"

                    />
                    <Label htmlFor={`sizes.${index}.checked`} className="text-md">
                      {size.name.charAt(0).toUpperCase() + size.name.slice(1)}
                    </Label>
                    <span
                      className="ml-2 cursor-pointer"
                      onClick={() => handleRemoveSize(index)}
                    >
                      <X
                        className="w-4 h-4 rounded-full text-red-500 hover:bg-red-600 hover:text-white shadow hover:shadow-lg transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
                      />
                    </span>
                  </div>
                  {watch(`sizes.${index}.checked`) && size.name !== 'custom' && (
                    <div>
                      <Controller
                        name={`sizes.${index}.price`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <div>
                            <input
                              type="text"
                              {...field}
                              placeholder={`${size.name.charAt(0).toUpperCase() + size.name.slice(1)} Size Price`}
                              className={`w-full p-2 rounded-md ${errors?.sizes?.[index]?.price ? 'border-red-500 border-2 rounded-lg' : ''
                                }`}
                            />
                            {errors.sizes && errors.sizes[index] && errors.sizes[index].price && (
                              <p className="text-sm font-semibold text-red-600 mt-2">
                                {errors.sizes[index].price.message}
                              </p>
                            )}
                          </div>
                        )}
                        rules={{
                          pattern: {
                            value: /^[0-9]+(\.[0-9]{1,2})?$/,
                            message: 'Invalid decimal number',
                          },
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sizeFields.map((size, index) => (
              size.name === 'custom' &&
              size.checked && (
                <div key={index} className="mb-2 py-2">
                  <Label htmlFor={`sizes.${index}.customSizeName`} className="text-md">
                    Custom Size Name
                  </Label>
                  <input
                    type="text"
                    id={`sizes.${index}.customSizeName`}
                    placeholder="Custom Size Name"
                    {...register(`sizes.${index}.customSizeName`, { required: 'This is a required field' })}
                    className={`w-full p-2 rounded-md ${errors?.sizes?.[index]?.customSizeName ? 'border-red-500 border-2 rounded-lg' : ''
                      }`}
                  />
                  {errors.sizes && errors.sizes[index] && errors.sizes[index].customSizeName && (
                    <p className="text-sm font-semibold text-red-600 mt-2">
                      {errors.sizes[index].customSizeName.message}
                    </p>
                  )}

                  {/* TODO: Add the rule check for decimal */}
                  <Label htmlFor={`sizes.${index}.customSizePrice`} className="text-md">
                    Custom Size Price
                  </Label>
                  <input
                    type="text"
                    id={`sizes.${index}.customSizePrice`}
                    placeholder="Custom Size Price"
                    {...register(`sizes.${index}.customSizePrice`, { required: 'This is a required field', pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                    className={`w-full p-2 rounded-md ${errors?.sizes?.[index]?.customSizePrice ? 'border-red-500 border-2 rounded-lg' : ''
                      }`}
                  />
                  {errors.sizes && errors.sizes[index] && errors.sizes[index].customSizePrice && (
                    <p className="text-sm font-semibold text-red-600 mt-2">
                      {errors.sizes[index].customSizePrice.message}
                    </p>
                  )}
                </div>
              )
            ))}

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleAddCustomSize}
                className="sm:w-auto flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                <span>Add Custom Size</span>
              </button>
            </div>
          </div>

          {/* Addons */}
          <div className="mb-4">
            <div className="block mb-2">
              <Label htmlFor="noAddons" className="text-md font-bold">
                Addons
              </Label>
            </div>

            <div className="flex items-center mb-2">
              <Checkbox
                type="checkbox"
                id="noAddons"
                {...register('noAddons')}
                defaultValues
                className="mr-2"
              />
              <Label htmlFor="noAddons" className="text-md">
                No Addons
              </Label>
            </div>

            {/* Conditional fields based on noAddons checkbox */}
            {!watch('noAddons') && (
              <div className="mb-2">
                {addonFields.map((addon, index) => (
                  <div key={addon.id} className="flex items-center my-4 p-2">
                    <div className="flex-grow">
                      <Label htmlFor={`addons.${index}.addonName`} className="text-md">
                        Addon Name
                      </Label>
                      <Controller
                        name={`addons.${index}.addonName`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <div>
                            <input
                              type="text"
                              {...field}
                              placeholder="Addon Name"
                              className={`w-full p-2 rounded-md ${errors?.addons?.[index]?.addonName ? 'border-red-500 border-2 rounded-lg' : ''
                                }`}
                            />
                            {errors.addons && errors.addons[index] && errors.addons[index].addonName && (
                              <p className="text-sm font-semibold text-red-600 mt-2">
                                {errors.addons[index].addonName.message}
                              </p>
                            )}
                          </div>
                        )}
                        rules={{
                          required: 'This is a required field',
                        }}
                      />

                      <Label htmlFor={`addons.${index}.addonPrice`} className="text-md">
                        Addon Price
                      </Label>
                      <Controller
                        name={`addons.${index}.addonPrice`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <div>
                            <input
                              type="text"
                              {...field}
                              placeholder="Addon Price"
                              className={`w-full p-2 rounded-md ${errors?.addons?.[index]?.addonPrice ? 'border-red-500 border-2 rounded-lg' : ''
                                }`}
                            />
                            {errors.addons && errors.addons[index] && errors.addons[index].addonPrice && (
                              <p className="text-sm font-semibold text-red-600 mt-2">
                                {errors.addons[index].addonPrice.message}
                              </p>
                            )}
                          </div>
                        )}
                        rules={{
                          required: 'This is a required field',
                          pattern: {
                            value: /^[0-9]+(\.[0-9]{1,2})?$/,
                            message: 'Invalid decimal number',
                          },
                        }}
                      />
                    </div>
                    {/* Button for Remove Addon */}
                    <div className='right-11 mb-36'>
                      <span
                        className="ml-2 cursor-pointer"
                        onClick={() => handleRemoveAddon(index)}
                      >
                        <X
                          className="w-4 h-4 rounded-full text-red-500 hover:bg-red-600 hover:text-white shadow hover:shadow-lg transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
                        />
                      </span>
                    </div>
                  </div>
                ))}

                {/* Button for Add Addons */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={handleAddAddon}
                    className=" sm:w-auto flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /><span>Add Addons</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Allergens */}
          {/* <div className="mb-4">
            <Label htmlFor="allergens" className="text-md">
              Allergens
            </Label>
            <span className='flex text-xs text-red-600'>(Not included in the onSubmit)</span>
            {allergensOptions.map((allergen, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  {...registerAllergens(`allergens.${allergen}`)}  // Use registerAllergens with the correct path
                  className="mr-2"
                />
                <Label htmlFor={`allergens.${index} `} className="text-md">
                  {allergen}
                </Label>
              </div>
            ))}
          </div> */}

          {/* Nutritional Information */}
          {/* Nutritional Information */}
          <div className="mb-4">
            <Label htmlFor="nutritionalInfo" className="text-md font-bold">
              Nutritional Information
            </Label>
            <div>
              {nutritionalInfoFields.map((field) => (
                <div key={field}>
                  <Label htmlFor={`nutritionalInfo.${field}`} className="text-md">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <input
                    type="text"
                    id={`nutritionalInfo.${field}`}
                    {...register(`nutritionalInfo.${field}`)}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className={`w-full p-2 rounded-md ${errors?.nutritionalInfo?.[field] ? 'border-red-500 border-2 rounded-lg' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>


          {/* Dietary Information */}
          {/* <div className="mb-4">
            <Label htmlFor="dietaryInformation" className="text-md">
              Dietary Information
            </Label>
            <span className='flex text-xs text-red-600'>(Not included in the onSubmit)</span>

            {dietaryInfoOptions.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  {...registerDietaryInfo(`dietaryInformation.${index} `)}
                  className="mr-2"
                />
                <Label htmlFor={`dietaryInformation.${index} `} className="text-md">
                  {option}
                </Label>
              </div>
            ))}
          </div> */}

          {/* Preparation Time */}
          <div className="mb-4 flex flex-col">
            <Label htmlFor="preparationTime" className="text-md">
              Preparation Time (in minutes)
            </Label>
            <input
              type="text"
              id="preparationTime"
              {...register('preparationTime', { required: true, pattern: /^[1-9][0-9]*$/ })}
              placeholder="Preparation Time"
              className={`w-full p-2 rounded-md ${errors.preparationTime ? 'border-red-500 border-2 rounded-lg' : ''} `}
            />
            {errors.preparationTime && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.preparationTime.type === 'required'
                  ? 'This is a required field'
                  : 'Invalid Preparation Time'}
              </span>
            )}
          </div>

          <div className='pb-4'>
            <Label htmlFor="productDescription" className="text-md">
              Product Description
            </Label>
            <Textarea
              id="productDescription"
              placeholder="Product Description"
              {...register('productDescription', {
                required: 'Product Description is required.',
                maxLength: {
                  value: 255,
                  message: 'Product Description should not exceed 255 characters.',
                },
              })}
              className={`w-full p-2 rounded-md ${errors.productDescription ? 'border-red-500 border-2 rounded-lg' : ''}`}
            />
            {errors.productDescription && (
              <p className="text-red-600 text-sm font-semibold">
                {errors.productDescription.message}
              </p>
            )}
          </div>

          {/* Set Visibility */}
          <div className="mb-4">
            <div className="block mb-2">
              <Label htmlFor="isPublished" className="text-md font-bold" value="Set Published" />
            </div>

            <Switch
              id="isPublished"
              checked={isPublished}
              onChange={(value) => setValue('isPublished', value)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600  rounded"
            />
          </div>

          {/* Set Featured */}
          <div className="mb-4">
            <div className="block mb-2">
              <Label htmlFor="isFeatured" className="text-md font-bold" value="Set Featured" />
            </div>

            <Switch
              id="isFeatured"
              checked={isFeatured}
              onChange={(value) => setValue('isFeatured', value)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600  rounded"
            />
          </div>



          {/* Image Upload */}
          {/* TODO: Add a progressbar for the image upload */}
          <div className="mb-4">
            <div className="block mb-2">
              <Label htmlFor="images" className="text-md font-bold">
                Image Upload
              </Label>
              <span className="ml-0.5 text-red-600 font-semibold text-md">*</span>
            </div>

            <div {...getRootProps()} className={`dropzone`}>
              <input {...getInputProps()} />
              <div className="flex flex-col border-2 border-dashed border-blue-400 items-center justify-center p-4 cursor-pointer">
                <UploadCloudIcon className="w-32 h-16 text-blue-500" />
                <p className="text-gray-600">Drag 'n' drop some files here, or click to select files</p>
              </div>
            </div>

            {(selectedImageFiles.length === 0 || errors.images) && (
              <p className="text-sm font-semibold text-red-600 mt-2">
                {errors.images ? errors.images.message : 'Upload at least one image.'}
              </p>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                // e.stopPropagation();
                deleteImageFromFirebase(filePath);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 shadow hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              <X className="w-4 h-4" />
            </button>

            {firebaseImageUrl && (
              <img src={firebaseImageUrl} alt="Uploaded Image" className="max-w-[300px] my-4" />

            )}
          </div>

          <div className="flex justify-between space-x-4">
            <div className="w-full sm:w-auto">
              <button
                type="submit"
                className=" sm:w-auto bg-green-500 flex items-center text-white px-4 py-2 rounded-md hover:bg-green-700 shadow hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                <Send className="w-4 h-4 mr-2" />
                Add New Product
              </button>
            </div>

            <div className="w-full sm:w-auto flex justify-end mr-2">
              <button
                type="button"
                onClick={handleClearForm}
                className=" sm:w-auto flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 shadow hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Clear Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );

};




