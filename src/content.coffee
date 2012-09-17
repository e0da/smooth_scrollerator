###
Smooth Scrollerator
Copyright © 2012 by Justin Force
Licensed under the MIT license
https://github.com/justinforce/smooth_scrollerator
###

#
# SmoothScrollerator maintains a queue of animated scroll operations to execute
# ("Steps"). Every time a relevant key is pressed or a scroll action comes from
# a pointing device (mouse or trackpad), add a step to the queue. Immediately
# begin executing the queue (animated scrolling), and flush the queue when you
# get to the end. This keeps the UI quick and responsive.
#

#
# TODO make these adjustable options
#
STEP_SIZE = 120

# JavaScript keyCode values
#
KEYS =
  SPACE: 32
  LEFT:  37
  RIGHT: 39
  UP:    38
  DOWN:  40

class Step

  constructor: (event)->
    @event = event
    @target = target()
    [@x, @y] = x_y()

  x_y = ->
    switch @event.constructor
      when WheelEvent
        x = -@event.wheelDeltaX
        y = -@event.wheelDeltaY
      when KeyboardEvent
        switch @event.keyCode
          when KEYS.LEFT             then x = -STEP_SIZE
          when KEYS.RIGHT            then x =  STEP_SIZE
          when KEYS.UP               then y = -STEP_SIZE
          when KEYS.DOWN, KEYS.SPACE then y =  STEP_SIZE
    [x or 0, y or 0]

  target = ->
    @event.target

class SmoothScrollerator

  constructor: ->
    @queue = []
    @add_scroll_listener event_type for event_type in ['mousewheel', 'keydown']

  add_scroll_listener: (event_type)->
    window.addEventListener event_type, (event)=>
      @queue_scroll(event)
    , false

  queue_scroll: (event)->
    step = new Step(event)
    return true if step.x is 0 and step.y is 0 # nothing to do
    @queue.push step
    @process_queue()

  process_queue: ->
    @scroll step for step in @queue

  scroll: (step)->
    #
    # TODO scroll animation happens (or is invoked) here
    #
    console.log step # TODO remove debug line
    @queue.pop()

new SmoothScrollerator
