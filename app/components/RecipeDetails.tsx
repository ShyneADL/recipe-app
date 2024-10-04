import { Fragment } from "react";
import Image from "next/image";
import {
  gatherDirections,
  gatherIngredientsAndMeasurements,
  getChefHatCount,
} from "@/app/utils";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import { RecipeDetailsProps } from "@/app/types";

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  isOpen,
  closeModal,
  recipe,
}) => {
  const directions = gatherDirections(recipe);
  const ingredients = gatherIngredientsAndMeasurements(recipe);
  const chefHatCount = getChefHatCount(recipe.difficulty);
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 details-wrapper"
          onClose={closeModal}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-out duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col gap-5 details-wrapper">
                  <button
                    type="button"
                    className="absolute top-2 right-2 z-10 w-fit p-2 bg-primary-red-100 rounded-full"
                    onClick={closeModal}
                  >
                    <Image
                      src="/close.svg"
                      alt="close"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </button>
                  <Image
                    src={recipe.image}
                    alt={recipe.recipe}
                    className="recipe-image"
                    width={200}
                    height={200}
                  />
                  {/* Recipe info */}
                  <div className="flex items-center flex-wrap gap-2 justify-between w-full">
                    {/* Servings */}
                    <div className="recipe-infobox">
                      <Image
                        src="/person.svg"
                        alt="person icon"
                        width={20}
                        height={20}
                        className="w-[20px]"
                      />
                      <p className="recipe-infotext">
                        {recipe.serving}{" "}
                        {recipe.serving === 1 ? "serving" : "servings"}
                      </p>
                    </div>
                    {/* Prep time */}
                    <div className="recipe-infobox">
                      <p className="recipe-infotext">
                        {recipe.cook_time_in_minutes === 0
                          ? recipe.prep_time_in_minutes
                          : recipe.cook_time_in_minutes}{" "}
                        min
                      </p>
                    </div>
                    {/* Category */}
                    <div className="recipe-infobox">
                      <p className="recipe-infotext">
                        {recipe.category.category}
                      </p>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="flex flex-col items-start gap-2">
                    <h2 className="recipe-info-title">Ingredients:</h2>
                    <ul className="recipe-list">
                      {ingredients.map((item, index) =>
                        item.ingredient ? (
                          <li
                            className="recipe-small-text flex flex-col items-start gap-3 w-full"
                            key={index}
                          >
                            <div className="flex justify-between items-center w-full">
                              <p>{item.ingredient}</p>
                              <p>
                                {item.measurement ? `${item.measurement} ` : ""}
                              </p>
                            </div>
                            <div className="bg-lightGrey rounded-2xl w-full h-[3px]" />
                          </li>
                        ) : null
                      )}
                    </ul>
                  </div>

                  {/* Nutritional info */}
                  <div className="flex flex-col items-start gap-2">
                    <h2 className="recipe-info-title">Nutritional Info:</h2>
                    <ul className="recipe-list">
                      <li className="recipe-small-text flex flex-col items-start gap-3 w-full">
                        <div className="flex justify-between items-center w-full">
                          <p>Calories:</p>
                          <p>{recipe.calories}kcal</p>
                        </div>
                        <div className="bg-lightGrey rounded-2xl w-full h-[3px]" />
                      </li>
                      <li className="recipe-small-text flex flex-col items-start gap-3 w-full">
                        <div className="flex justify-between items-center w-full">
                          <p>Carbohydrates:</p>
                          <p>{recipe.carbohydrates_in_grams} g</p>
                        </div>
                        <div className="bg-lightGrey rounded-2xl w-full h-[3px]" />
                      </li>
                      <li className="recipe-small-text flex flex-col items-start gap-3 w-full">
                        <div className="flex justify-between items-center w-full">
                          <p>Fat:</p>
                          <p>{recipe.fat_in_grams} g</p>
                        </div>
                        <div className="bg-lightGrey rounded-2xl w-full h-[3px]" />
                      </li>
                      <li className="recipe-small-text flex flex-col items-start gap-3 w-full">
                        <div className="flex justify-between items-center w-full">
                          <p>Protein:</p>
                          <p>{recipe.protein_in_grams} g</p>
                        </div>
                        <div className="bg-lightGrey rounded-2xl w-full h-[3px]" />
                      </li>
                    </ul>
                  </div>
                  {/* Directions */}
                  <div className="flex flex-col items-start gap-2">
                    <h2 className="recipe-info-title">Directions:</h2>
                    <ul className="recipe-list">
                      {directions.map((direction, index) =>
                        direction ? (
                          <li
                            key={index}
                            className="recipe-small-text flex flex-col items-start gap-3 w-full"
                          >
                            <p>
                              {index + 1}. {direction}
                            </p>
                            <div className="bg-lightGrey rounded-2xl w-full h-[3px]" />
                          </li>
                        ) : null
                      )}
                    </ul>
                  </div>
                  {/* Difficulty */}
                  <div className="flex items-center gap-1">
                    <p className="recipe-info-title">Difficulty:</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: chefHatCount }).map((_, index) => (
                        <Image
                          key={index}
                          src="/chef.png"
                          alt="chef hat icon"
                          width={40}
                          height={40}
                          className="chef-hat"
                          style={{ width: "40px", height: "40px" }}
                        />
                      ))}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default RecipeDetails;
